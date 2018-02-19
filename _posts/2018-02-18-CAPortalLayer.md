---
layout: post
title:  "CAPortalLayer"
date:   2018-02-18 00:00:00 -0900
---

# CAPortalLayer

In the macOS 10.13.4 beta, I spotted a new `CALayer` class called `CAPortalLayer` being used in AppKit, and apparently also in UIKit. After looking into it a bit more, it turns out it does exactly what `CAPluginLayer` did for `CGSWindow`/`NSWindow` but for `CALayer`s! I've neglected to provide a screenshot because it really doesn't look like much (it does update in realtime though).

```swift
let layer = CAPortalLayer()
layer.frame = CGRect(x: 10, y: 10, width: 200, height: 200)
layer.sourceLayer = self.view.layer!
//layer.sourceContextId = 0
//layer.sourceLayerRenderId = 0
layer.hidesSourceLayer = false // try out true as well!
//layer.matchesOpacity = true // apparently always true
//layer.matchesPosition = false // apparently always true
//layer.matchesTransform = true // apparently always true
self.parentView.layer?.addSublayer(layer)
```

Notice in the code sample, all we needed to do was set `sourceLayer` to an existing valid layer and it worked! There are two more interesting properties here as well: `sourceLayerRenderId` and `sourceContextId` -- it appears that you must set `sourceLayerRenderId` for `sourceContextId` to matter to the render server (backboardd on iOS and windowserver on macOS). What these properties allow you to do is "portal" a layer from **any process whose context you know of** - just like with `CAPluginLayer`.  Just send the `CAContext.contextId` over the wire from a friendly process and it'll render. Unlike `CALayerHost` et al. however, the originating layer will **also** render on-screen (unless `hidesSourceLayer` is `true`). How do you get the `sourceLayerRenderId` you might ask? Here's the function prototype: `NSUInteger CALayerGetRenderId(CALayer *);` -- it won't be hard.

P.S. I originally tested this on iOS using the private `_UIPortalView` class. On macOS, AppKit has `NSPortalView` as well as `NSPortalView1` and `NSPortalView2` for some weird reason.
