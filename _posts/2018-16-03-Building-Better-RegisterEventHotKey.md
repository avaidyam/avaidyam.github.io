---
layout: post
title:  "Building a Better RegisterEventHotKey"
date:   2018-16-03 00:00:00 -0900
---

#  Building a Better `RegisterEventHotKey`!

Okay, well, maybe not better, but at least, not under imminent threat of deprecation - and even that is questionable, because we'll be using `[Private SPI]` (I mean, would you really be here reading this if it didn't? At least I've marked it all so you can cut it out for MAS apps.)

Recently, I've wanted to get around to adding "hot key" support for Parrot, and realized I didn't like any of the existing solutions:

1. Use `MASShortcut` or `ShortcutRecorder` which are tried and proven to work in ObjC-land.
2. Use a new but not proven Swift hotkey recorder (there's a few out there).
3. Roll my own using dangerous private SPI and not test it at all! 

*Obviously I went with option #3.* 

I ended up building a µFramework (everything these days is one, right?) that handles hotkeys, provides a user input and display for hotkeys, and a small high-level recognizer platform to handle them with ease. I'll walk you, the reader, through each step! But first, I want to clarify something: the terms "hot key", "key equivalent", "keyboard shortcut", and "mnemonic" are not the same things, on the same or different (i.e. macOS vs Windows) platforms, and so here, I've chosen "keyboard shortcut" as the most descriptive term. 

Before we get into the nitty gritty hand-holding pair-programming stuff, if you'd like to jump straight to the comment-annotated final source code, [I've included a snapshot here.](https://gist.github.com/avaidyam/32975976c23dd3b38336f22d971f5eaa) It's the whole final product, exactly 1500 LOC, including the code from the next "episode" - a corresponding keyboard shortcut recording control! If you think this should be a formal repository and whatnot, contact me on Twitter or Github @avaidyam!

--- 

## How does `RegisterEventHotKey` work?

### Disassembly & Reverse Engineering

The first step to designing a better `X` is to understand how `X` works. To do that, whip out `Hopper` (I'm not paid to say this but if you don't have this app yet, you definitely need it!) and disassemble `/System/Library/Carbon.framework/Frameworks/HIToolbox.framework`. Locate the function and take a peek -- or, if you'd like, [just take a look at my cleaned up version of the function here.](https://gist.github.com/avaidyam/18b7c3d0a15afade931d10a27ed53872) I also added a similar function from `ScreenReader.framework` to cross-reference with.

All the function basically does is wrap its parameters into an internal data type and call through to `SkyLight.framework` (you may know it as `CoreGraphicsServices`, from `CoreGraphics.framework` on pre-macOS 12) while keeping track of the hotkey registration in a static var dictionary. I'll come back to the CoreGraphics call in a little bit, because this function does something very interesting... we'll also ignore the `CGSSetHotButtonWithExclusion` call, which is actually an alias for the function `CGSSetHotKeyRepresentationWithOptions`, because that's not what we want right now. We'll instead be using `CGSSetHotKeyWithExclusion`. 

### CGSHotKey Symbols

Here's a complete list of `CGSHot*` symbols:
* `CGSGetHotButton`
* `CGSGetHotKeyRepresentation`
* `CGSGetHotKeyType`
* `CGSGetHotModifier`
* `CGSSetHotButtonWithExclusion`
* `CGSSetHotKeyEnabled`
* `CGSSetHotKeyRepresentation`
* `CGSSetHotKeyRepresentationWithOptions`
* `CGSSetHotKeyType`
* `CGSSetHotKeyWithExclusion`
* `CGSSetHotKeyWithOptions`
* `CGSSetHotModifierWithExclusion`
* `CGSSetHotModifierWithOptions`
* `CGSGetSymbolicHotKeyButtonValue`
* `CGSGetSymbolicHotKeyRepresentation`
* `CGSGetSymbolicHotKeyRepresentationList`
* `CGSGetSymbolicHotKeyValuesAndStates`
* `CGSGetSymbolicHotModifierValue`
* `CGSSetSymbolicHotKey`
* `CGSSetSymbolicHotKeyButtonValue`
* `CGSSetSymbolicHotKeyEnabledForConnection`
* `CGSSetSymbolicHotKeyRepresentation`
* `CGSSetSymbolicHotKeyValue`
* `CGSSetSymbolicHotKeyWithExclusion`
* `CGSSetSymbolicHotKeyWithOptions`
* `CGSSetSymbolicHotModifierValue`
* `CGSIsSymbolicHotKeyEnabledForConnection`

I'll demystify some of these symbols: there are two types of "hot" events: **regular**, and **symbolic**. Symbolic hot events are those that the `WindowServer` has designated and named. [You can find a near-full list of symbolic identifiers here.](https://github.com/NUIKit/CGSInternal/blob/master/CGSHotKeys.h#L38) These include things like Exposé or Screenshot keys, basically those that are defined in the "System Preferences > Keyboard > Shortcut" pane. 

Now, within these types, there are subtypes: `HotKey`, `HotButton`, `HotModifier`, and `HotKeyRepresentation`. `HotButton` is actually just an alias for `HotKeyRepresentation`, which I'll admit, I'm not savvy to the reason behind its specific distinction. `HotModifier` is just that -- a modifier press that activates an event, like Siri or Dictation shortcuts. Finally, what we want, is the `HotKey` facility, which is a plain old keyboard shortcut, with a virtual key code, and a modifier list. 

There is a special `WithExclusion` function, which calls through to `WithOptions` (presumably, there are more options, but I doubt any are used right now): setting a hot key with exclusion implies that no other application (including the calling one) may register this same hot key again, and if it was already acquired by another application, the call fails. As far as I'm able to tell, this is the behavior, but I can't be sure since I haven't dug deeper into this option.

--- 

## Building a replacement: `CGSKeyboardShortcut`!

Since we've got a cursory understanding of how the existing Carbon facility works, and what hot events facilities Window Server offers, we can architect our own version. 

```swift
public final class CGSKeyboardShortcut: Hashable {
	// ...
}
```

### Properties & Acquisition Policy

A keyboard shortcut needs a virtual key code (`CGKeyCode`), modifier flags (`CGEventFlags`, instead of `NSEvent.ModifierFlags`), and an identifier (we'll create a intly-typed wrapper, for better developer&user-side management), at the very least.

```swift
public struct Identifier: RawRepresentable, Hashable, Codable {
    public typealias RawValue = Int
    public let rawValue: Identifier.RawValue
    public init(rawValue: Identifier.RawValue) {
        self.rawValue = rawValue
    }
    public init(_ rawValue: Identifier.RawValue) {
        self.rawValue = rawValue
    }
}

public let identifier: CGSKeyboardShortcut.Identifier
public let keyCode: CGKeyCode
public let modifierFlags: CGEventFlags
```

Now, returning to the issue of `WithExclusion`, we'll also add an `AcquisitionPolicy` to handle that:

```swift
public enum AcquisitionPolicy: Int, Codable {
    case none
    case exclusively
    case exclusivelyIfPossible
}
public let acquisitionPolicy: AcquisitionPolicy

public init(identifier: CGSKeyboardShortcut.Identifier, keyCode: CGKeyCode,
       modifierFlags: CGEventFlags, acquisitionPolicy: AcquisitionPolicy = .none) throws
{
	// ...
    self.identifier = identifier
    self.keyCode = keyCode
    self.modifierFlags = modifierFlags
    self.acquisitionPolicy = acquisitionPolicy
    // ...
}
```

Essentially, this will be the policy to use when initializing a new `CGSKeyboardShortcut` - do we want to do so `exclusively`, not (`none`) at all, or maybe `exclusivelyIfPossible`? The final option is a special case where we'll attempt to be exclusive, but if someone else got to the shortcut first, we still do want a shortcut event delivered to our handler. (Note that we shouldn't be considering this value in equality between two `CGSKeyboardShortcut`s.)

### Resource Management

Since keyboard shortcuts are something of a finite resource (there are only so many key combinations viable for user input) and application or component acquisition matters, we'll keep a `Set` of registered keyboard shortcuts at all times, but note that we can only keep track of the shortcuts tracked through our new facility, and not those by `CGS` or `HIToolbox` facilities, unfortunately.

```swift
public private(set) static var all: Set<CGSKeyboardShortcut> = []

public init(...) {
    guard CGSKeyboardShortcut.all.filter({ $0.identifier == identifier }).count == 0 else {
        throw CGError.cannotComplete
    }
	// ...
	CGSKeyboardShortcut.all.insert(self)
}

deinit {
	CGSKeyboardShortcut.all.remove(self)
}
```

There is an issue with this mechanism as it stands, though. If we'd like to invalidate a keyboard shortcut, we have no way of `deinit`ing it without removing it from the `Set`, which only happens upon `deinit`! That's a problem, so we'll add an explicit `invalidate` method (or two).

```swift

deinit {
	self.invalidate()
}
public func invalidate() {
    // ...
    CGSKeyboardShortcut.all.remove(self)
}
public static func invalidateAll() {
    CGSKeyboardShortcut.all = []
}
```

There, that's a little better. Now, we don't need to hold an explicit reference to a shortcut to keep it valid, and we'll need this `Set` for actually handling shortcuts soon anyway. 

### WindowServer Acquisition & Invalidation

Now that we've defined our shortcut class and its containment/usage policies, how do we actually... you know, make it do stuff? For that, we'll need to add a suffix to our file here:

```swift
// Here lie dragons!
fileprivate typealias CGSConnectionID = UInt
@_silgen_name("CGSMainConnectionID")
fileprivate func CGSMainConnectionID() -> CGSConnectionID
@_silgen_name("CGSSetHotKeyWithExclusion")
fileprivate func CGSSetHotKeyWithExclusion(_ connection: CGSConnectionID,
                                           _ hotKeyID: Int,
                                           _ hotKeyMask: UInt16, // always 0xffff
                                           _ keyCode: UInt16,
                                           _ modifierFlags: UInt64,
                                           _ options: Int8) -> CGError
@_silgen_name("CGSSetHotKeyType")
fileprivate func CGSSetHotKeyType(_ connection: CGSConnectionID,
                                  _ hotKeyID: Int,
                                  _ options: Int8) -> CGError
@_silgen_name("CGSSetHotKeyEnabled")
fileprivate func CGSSetHotKeyEnabled(_ connection: CGSConnectionID,
                                     _ hotKeyID: Int,
                                     _ enabled: Bool) -> CGError
@_silgen_name("CGSIsHotKeyEnabled")
fileprivate func CGSIsHotKeyEnabled(_ connection: CGSConnectionID,
                                    _ hotKeyID: Int) -> Bool
@_silgen_name("CGSRemoveHotKey")
fileprivate func CGSRemoveHotKey(_ connection: CGSConnectionID,
                                 _ hotKeyID: Int) -> CGError
```

This is a horrible terrible idea. But then again, you've read this much already, so you're probably okay with this sick twisted kind of stuff. :)  After elucidating the function arguments, we're using `@_silgen_name` to tell the Swift compiler that "hey, these functions exist somewhere, so just go along with my devious plans". Obviously, if anything goes wrong, you're on your own. Be careful with this block of code. 

Now we'll register and unregister the shortcut where necessary, and add a way to enable or disable the shortcut (since `WindowServer` allows us this functionality).

```swift

public var isEnabled: Bool {
    get { return CGSIsHotKeyEnabled(CGSMainConnectionID(), self.identifier.rawValue) }
    set { _ = CGSSetHotKeyEnabled(CGSMainConnectionID(), self.identifier.rawValue, newValue) }
}

public init(...) {
    // ...

    var error: CGError = .success
    error = CGSSetHotKeyWithExclusion(CGSMainConnectionID(), self.identifier.rawValue,
                                      0xffff, self.keyCode, self.modifierFlags.rawValue,
                                      self.acquisitionPolicy == .none ? 0x0 : 0x1)
    
    // If our acquisition policy can fallback, register non-exclusively.
    if error == .noneAvailable && self.acquisitionPolicy == .exclusivelyIfPossible {
        error = CGSSetHotKeyWithExclusion(CGSMainConnectionID(), self.identifier.rawValue,
                                          0xffff, self.keyCode, self.modifierFlags.rawValue, 0x0)
    }
    guard error == .success else { throw error }
    
    error = CGSSetHotKeyType(CGSMainConnectionID(), self.identifier.rawValue, 0x1)
    guard error == .success else { throw error }

    // ...
}

public func invalidate() {
    _ = CGSRemoveHotKey(CGSMainConnectionID(), self.identifier.rawValue)
    // ...
}
```

### Local Event Handling

Alright, now we've got a functioning shortcut right? Not yet! We actually need to get `WindowServer` to send **us** specifically the event for the shortcut! However, (it turns out, in macOS 6+) `NSApplication` actually handles these kinds of events in `-sendEvent:`, but we need to register an event monitor to be notified of them. Let's use a local `NSEvent` monitor to trampoline notifications into `NotificationCenter`.

```swift
public static let pressedNotification = Notification.Name("CGSKeyboardShortcut.pressedNotification")
public static let releasedNotification = Notification.Name("CGSKeyboardShortcut.releasedNotification")

private static var monitor = NSEvent.addLocalMonitorForEvents(matching: .systemDefined) { event in
    if [6, 9].contains(event.subtype.rawValue) {
        CGSKeyboardShortcut.all.filter { $0.identifier.rawValue == event.data1 }.forEach { obj in
            let name: Notification.Name = event.subtype.rawValue == 6
                ? CGSKeyboardShortcut.pressedNotification /* 6 */
                : CGSKeyboardShortcut.releasedNotification /* 9 */
            NotificationCenter.default.post(name: name, object: obj)
        }
        return nil // consumed
    }
    return event
}

public init(...) {
	_ = CGSKeyboardShortcut.monitor // bootstrap!
	// ...
}
```

All we've done here is grab the shortcut identifier from the `data1` field of the `.systemDefined` event if it's of `subtype` `6` or `9`, which are the `-keyDown:` and `-keyUp:` event subtypes, respectively. Once we've done so, and our facility registered the shortcut (that is, not Carbon or another CGS client), bounce the event into a notification. Be sure to "bootstrap" the event monitor in your `init`, otherwise it'll never be initialized and trampoline shortcut events.

Here, I've explicitly chosen to use `NotificationCenter` over a delegation or target-action/handler pattern, because it turns a single-producer (the user input) single-consumer (portions of our app) model into a single-producer multiple-consumer pattern. With a single shortcut registration, multiple components can share event information. If we wanted a shortcut to be exclusive to the app, but multiple components acted on it, we would either end up in a hairy mess or end up using `NotificationCenter` anyway. 

### The Magic Within `RegisterEventHotKey`

Remember how earlier, I said `RegisterEventHotKey` was doing something interesting? It `malloc`'s what I'm dubbing a `HotButtonData` to hold hot key parameters (presumably) and uses its pointer as the hot key identifier! Holy carp, that's insanely bad practice! It is, however, an extremely intelligent alternative to our global `Set`. That was really it. I found it pretty interesting, and I'm not even really sure if that was developer-intended or a compiler optimization/mangling of some sort. :)

### Frozen Representations

While we've now built a complete and functional shortcut facility, we have no way of storing a shortcut in a non-live, or frozen, way. We could make our class `Codable`, our initializer is where shortcut registration occurs, and invoking a `Codable` initializer should not have any side effects. Instead, I've opted for a design that mirrors only the internal properties of the shortcut class but with no activity of its own, called `CGSKeyboardShortcut.Definition`. It's effectively a frozen version of a `CGSKeyboardShortcut`, and we can use this type to inform the client of our class that explicit initialization is required. While there may be better approaches to this problem, I feel that this solution separates the notion of a live shortcut and a frozen one pretty cleanly.

```swift
public struct Definition: Hashable, Codable {
    public let identifier: CGSKeyboardShortcut.Identifier
    public let keyCode: CGKeyCode
    public let modifierFlags: CGEventFlags
    public let acquisitionPolicy: AcquisitionPolicy
    
    public init(identifier: CGSKeyboardShortcut.Identifier, keyCode: CGKeyCode, modifierFlags: CGEventFlags, acquisitionPolicy: AcquisitionPolicy) {
        self.identifier = identifier
        self.keyCode = keyCode
        self.modifierFlags = modifierFlags
        self.acquisitionPolicy = acquisitionPolicy
    }
}

public convenience init(definition: Definition) throws {
    try self.init(identifier: definition.identifier, keyCode: definition.keyCode,
                  modifierFlags: definition.modifierFlags,
                  acquisitionPolicy: definition.acquisitionPolicy)
}

public var definition: Definition {
    return Definition(identifier: self.identifier, keyCode: self.keyCode,
                      modifierFlags: self.modifierFlags,
                      acquisitionPolicy: self.acquisitionPolicy)
}
```

### CGKeyCode & CGEventFlags Supplements

Finally, we're not out of the woods yet. There's a slight issue with registering a shortcut with any old `NSEvent`-provided modifier flags - only a few flag bits are allowed (the physical key modifer ones)! Modify the line in `init(...) { ... }` that reads `self.modifierFlags = modifierFlags` to `self.modifierFlags = modifierFlags.intersection(.maskShortcutFlags)`. We'll define a few extensions to `CGEventFlags` to support this, and to allow conversion between `NSEvent.ModifierFlags`. In addition, we'll conform `CGError` to `Error` since it's not already for some reason...


```swift
extension CGError: Error {}

extension CGEventFlags: Hashable, Codable {
    public var hashValue: Int { return self.rawValue.hashValue }
}

public extension CGEventFlags {
    public init(_ flags: NSEvent.ModifierFlags) {
        self.init(rawValue: UInt64(flags.rawValue))
    }
    
    public static let maskDeviceIndependentFlags = CGEventFlags(rawValue: 0x00000000ffff0000)
    public static let maskShortcutFlags = CGEventFlags(rawValue: 0x0000000000ff0000)
    public static let maskUserFlags: CGEventFlags = [.maskCommand, .maskControl, .maskShift, .maskAlternate]
}

public extension NSEvent.ModifierFlags {
    public init(_ flags: CGEventFlags) {
        self.init(rawValue: UInt(flags.rawValue))
    }
}
```

---

## Building Higher-Order Recognizers

### Why?

Realistically, a developer could use the `CGSKeyboardShortcut` class as is and be perfectly fine! It does everything, after all, from maintaining the shortcut list, to trampolining events into notifications, and more. However, building "higher-order" facilities to handle complex interactions is well worth it, even if it means a little more code to accomplish the simple use-case (because remember, we're not removing the original facility, only building atop it). Let's define a `ShortcutRecognizer` protocol that takes two inputs: `keyDown` and `keyUp`, but does not provide a standard output. It'll be up to our implementing classes to do that.

```swift
public protocol ShortcutRecognizer: class {
    func keyDown()
    func keyUp()
}
```

So what would handling a shortcut, the normal way, look like with this protocol?

```swift
public final class PressShortcutRecognizer: ShortcutRecognizer {
    public let handler: () -> ()
    public init(_ handler: @escaping () -> ()) {
        self.handler = handler
    }
    
    public func keyDown() {
        /// ignored!
    }
    
    public func keyUp() {
        self.handler()
    }
}
```
Ugh, that's like, 10 extra lines of code and another class to deal with! But that's not the point! We've written something that doesn't actually rely on `CGS` facilities or even our `CGSKeyboardShortcut` facility! We don't even need to use this for shortcuts! It can do anything! (Maybe limiting its scope is a good thing to do though...) 

### How?

Okay, but the whole point of a recognizer type was to be able to simplify complex interactions, so how about this, an action in my app requires the user to do this exact sequence:  `keyDown` -> `keyUp` -> `keyDown` within 1sec -> `keyUp` after 2sec. 

It'll be a `TapHoldShortcutRecognizer` with a variable hold duration:
```swift
public final class TapHoldShortcutRecognizer: ShortcutRecognizer {
    private var timeInterval = DispatchTimeInterval.seconds(0)
    
    public let handler: () -> ()
    public init(for t: DispatchTimeInterval = .seconds(2), _ handler: @escaping () -> ()) {
        self.timeInterval = t
        self.handler = handler
    }
    
    public func keyDown() {
        // ...
    }
    
    public func keyUp() {
    	// ...
    }
}
```

Since we actually never need to handle the first `keyUp`, let's handle the double `keyDown` first, using a bool as well as a time marker, to maintain the inter-`keyDown` and hold durations. 

```swift
private var timeReference: CFAbsoluteTime = 0.0
private var inDoubleTap = false

public func keyDown() {
	defer { self.timeReference = CFAbsoluteTimeGetCurrent() }
	guard CFAbsoluteTimeGetCurrent() - self.timeReference < 1.0 else { return } // double-tapped

	self.inDoubleTap = true
	DispatchQueue.main.asyncAfter(deadline: .now() + self.timeInterval) {
		// ...
	}
}
```

We've put the time tracking in a `defer { ... }` statement because we want it execute only after the method has finished processing; it's just a marker of when we noticed the `keyDown`, after all. This way, our `guard` statement isn't affected either, and we can ignore the inter-`keyDown` interval. Notice that we're only using `DispatchTimeInterval` for the hold duration, to play nice with `DispatchQueue.asyncAfter(...)`. Once we enter the hold phase (that is, `keyDown` -> `keyUp` -> `keyDown` within 1sec -> ...), we can defer to the `keyUp()` function.


```swift
// ...
	DispatchQueue.main.asyncAfter(deadline: .now() + self.timeInterval) {
		guard self.inDoubleTap else { return }
		self.inDoubleTap = false
		DispatchQueue.main.async(execute: self.handler)
	}
}

public func keyUp() {
	guard self.inDoubleTap else { return }
	self.inDoubleTap = false
	print("shortcut recognizer failed because hold duration was \(CFAbsoluteTimeGetCurrent() - self.timeReference)s")
}
```

For the hold phase, we essentially race the user input to our designated hold duration: if the user gets there first (pressing the shortcut before the hold duration is up), we unset the double tap flag and bail our handler execution. Our inter-`keyDown` phase waited on the user to fail to `keyUp` so it could invoke the handler when we reached our hold duration. Clever, but there's probably a design pattern or something for this.

### Binding to a `CGSKeyboardShortcut`

It's now pretty simple to create a binder between a recognizer and a `CGSKeyboardShortcut`, by just adding the recognizer as an observer of... two... notifications... that's a little bit unwieldy. Instead, we can add a convenience function to add observers for both notifications and then return a single disposable value. If that value is `deinit`'ed, both observers are invalidated and the recognizer is effectively unbound! It's pretty straightforward.

```swift
public extension ShortcutRecognizer {
    public func bind(to shortcut: CGSKeyboardShortcut) -> Any {
        let x = NotificationCenter.default.addObserver(forName: CGSKeyboardShortcut.pressedNotification, object: shortcut, queue: nil) { _ in
            self.keyDown()
        }
        let y = NotificationCenter.default.addObserver(forName: CGSKeyboardShortcut.releasedNotification, object: shortcut, queue: nil) { _ in
            self.keyUp()
        }
        return _Holder([x, y])
    }
}

// Implementation Detail:
class _Holder {
    private let observers: [Any]
    public init(_ observers: [Any]) {
        self.observers = observers
    }
}
```

### Sample Usage

Complex user shortcut interaction becomes much cleaner now! Here's how we can use all of this together:

```swift
let hotkey = try CGSKeyboardShortcut(identifier: .myShortcut,
                                     keyCode: 0x7E,
                                     modifierFlags: [.maskCommand, .maskControl],
                                     acquisitionPolicy: .exclusivelyIfPossible)
let tracker = TapHoldShortcutRecognizer {
    _ = NSAlert(style: .informational, text: "Double tap and hold succeeded!").runModal()
}
self.observer = tracker.bind(to: hotkey)

// ... elsewhere ...
public extension CGSKeyboardShortcut.Identifier {
    public static let myShortcut = CGSKeyboardShortcut.Identifier(0xBAAAAAAD)
}
```

*(That `NSAlert` initializer is pretty easy to implement and is left as an exercise for the reader.)*

![Sample Alert](/assets/shortcut-recognizer-action.png)

---

## Conclusion

In short, there are better ways to do keyboard shortcuts than to resign to Carbon. Unfortunately, for those targeting the Mac App Store, this has just been an exercise in futility. An alternate implementation of `CGSKeyboardShortcut` could probably just wrap `RegisterEventHotKey` but that's no fun is it? Might as well just use `MASShortcut` or something else and not deal with writing it yourself. 

In the next episode, I'll be designing and developing a corresponding view to display and record keyboard shortcuts! If you have any questions, comments, or concerns, contact me on Twitter or Github @avaidyam!
