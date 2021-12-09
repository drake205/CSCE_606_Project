// const Key = Phaser.Input.Keyboard.Key;
// const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

// class CursorKeys {
//     constructor(scene) {
//         // scene: scene instance, or undefined
//         this.cursorKeys = {
//             up: new Key(scene, KeyCodes.UP),
//             down: new Key(scene, KeyCodes.DOWN),
//             left: new Key(scene, KeyCodes.LEFT),
//             right: new Key(scene, KeyCodes.RIGHT)
//         }
//         this.noKeyDown = true;
//     }

//     shutdown(fromScene) {
//         for (var key in this.cursorKeys) {
//             this.cursorKeys[key].destroy();
//         }
//         this.cursorKeys = undefined;
//     }

//     destroy(fromScene) {
//         shutdown(fromScene);
//     }

//     createCursorKeys() {
//         return this.cursorKeys;
//     }

//     setKeyState(keyName, isDown) {
//         var key = this.cursorKeys[keyName];

//         if (!key.enabled) {
//             return this;
//         }
//         if (isDown) {
//             this.noKeyDown = false;
//         }

//         if (key.isDown !== isDown) {
//             FakeEvent.timeStamp = Date.now();
//             FakeEvent.keyCode = key.keyCode;
//             if (isDown) {
//                 key.onDown(FakeEvent);
//             } else {
//                 key.onUp(FakeEvent);
//             }
//         }

//         return this;
//     }

//     clearAllKeysState() {
//         this.noKeyDown = true;
//         for (var keyName in this.cursorKeys) {
//             this.setKeyState(keyName, false);
//         }
//         return this;
//     }

//     getKeyState(keyName) {
//         return this.cursorKeys[keyName];
//     }

//     get upKeyDown() {
//         return this.cursorKeys.up.isDown;
//     }

//     get downKeyDown() {
//         return this.cursorKeys.down.isDown;
//     }

//     get leftKeyDown() {
//         return this.cursorKeys.left.isDown;
//     }

//     get rightKeyDown() {
//         return this.cursorKeys.right.isDown;
//     }

//     get anyKeyDown() {
//         return !this.noKeyDown;
//     }
// }

// var FakeEvent = {
//     timeStamp: 0,
//     keyCode: 0,
//     altKey: false,
//     ctrlKey: false,
//     shiftKey: false,
//     metaKey: false,
//     location: 0,
// };

// // export default CursorKeys;
// /**
//  * @author       Richard Davey <rich@photonstorm.com>
//  * @copyright    2018 Photon Storm Ltd.
//  * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
//  */

// var RAD_TO_DEG = 180 / Math.PI;

// /**
//  * Convert the given angle in radians, to the equivalent angle in degrees.
//  *
//  * @function Phaser.Math.RadToDeg
//  * @since 3.0.0
//  *
//  * @param {number} radians - The angle in radians to convert ot degrees.
//  *
//  * @return {integer} The given angle converted to degrees.
//  */
// var RadToDeg = function (radians)
// {
//     return radians * RAD_TO_DEG;
// };

// // export default RadToDeg;
// // export default {
// //     'up&down': 0,
// //     'left&right': 1,
// //     '4dir': 2,
// //     '8dir': 3
// // };
// var AngleToDirections = function (angle, dirMode, out) {
//     if (out === undefined) {
//         out = {}
//     } else if (out === true) {
//         out = globOut;
//     }

//     out.left = false;
//     out.right = false;
//     out.up = false;
//     out.down = false;

//     angle = (angle + 360) % 360;
//     switch (dirMode) {
//         case 0: // up & down
//             if (angle < 180) {
//                 out.down = true;
//             } else {
//                 out.up = true;
//             }
//             break;

//         case 1: // left & right
//             if ((angle > 90) && (angle <= 270)) {
//                 out.left = true;
//             } else {
//                 out.right = true;
//             }
//             break;

//         case 2: // 4 dir
//             if ((angle > 45) && (angle <= 135)) {
//                 out.down = true;
//             } else if ((angle > 135) && (angle <= 225)) {
//                 out.left = true;
//             } else if ((angle > 225) && (angle <= 315)) {
//                 out.up = true;
//             } else {
//                 out.right = true;
//             }
//             break;

//         case 3: // 8 dir
//             if ((angle > 22.5) && (angle <= 67.5)) {
//                 out.down = true;
//                 out.right = true;
//             } else if ((angle > 67.5) && (angle <= 112.5)) {
//                 out.down = true;
//             } else if ((angle > 112.5) && (angle <= 157.5)) {
//                 out.down = true;
//                 out.left = true;
//             } else if ((angle > 157.5) && (angle <= 202.5)) {
//                 out.left = true;
//             } else if ((angle > 202.5) && (angle <= 247.5)) {
//                 out.left = true;
//                 out.up = true;
//             } else if ((angle > 247.5) && (angle <= 292.5)) {
//                 out.up = true;
//             } else if ((angle > 292.5) && (angle <= 337.5)) {
//                 out.up = true;
//                 out.right = true;
//             } else {
//                 out.right = true;
//             }
//             break;
//     }

//     return out;
// };

// var globOut = {};

// // export default AngleToDirections;

// const GetValue = Phaser.Utils.Objects.GetValue;
// const GetDist = Phaser.Math.Distance.Between;
// const GetAngle = Phaser.Math.Angle.Between;

// class VectorToCursorKeys extends CursorKeys {
//     constructor(scene, config) {
//         super(scene);
//         this.resetFromJSON(config);
//     }

//     resetFromJSON(o) {
//         if (this.start == undefined) {
//             this.start = { x: 0, y: 0 };
//         }
//         if (this.end == undefined) {
//             this.end = { x: 0, y: 0 };
//         }
//         this._enable = undefined;
//         this.setEnable(GetValue(o, 'enable', true));
//         this.setMode(GetValue(o, 'dir', '8dir'));
//         this.setDistanceThreshold(GetValue(o, 'forceMin', 16));

//         var startX = GetValue(o, "start.x", null);
//         var startY = GetValue(o, "start.y", null);
//         var endX = GetValue(o, "end.x", null);
//         var endY = GetValue(o, "end.y", null);
//         this.setVector(startX, startY, endX, endY);
//         return this;
//     }

//     toJSON() {
//         return {
//             enable: this.enable,
//             dir: this.dirMode,
//             forceMin: this.forceMin,

//             start: {
//                 x: this.start.x,
//                 y: this.start.y
//             },
//             end: {
//                 x: this.end.x,
//                 y: this.end.y
//             }
//         };
//     }

//     setMode(m) {
//         if (typeof (m) === 'string') {
//             m = DIRMODE[m];
//         }
//         this.dirMode = m;
//         return this;
//     }

//     get enable() {
//         return this._enable;
//     }

//     set enable(e) {
//         if (this._enable === e) {
//             return;
//         }
//         if (!e) {
//             this.clearVector();
//         }
//         this._enable = e;
//         return this;
//     }

//     setEnable(e) {
//         if (e === undefined) {
//             e = true;
//         }

//         this.enable = e;
//         return this;
//     }

//     toggleEnable() {
//         this.setEnable(!this.enable);
//         return this;
//     }

//     setDistanceThreshold(d) {
//         if (d < 0) {
//             d = 0;
//         }
//         this.forceMin = d;
//         return this;
//     }

//     clearVector() {
//         this.start.x = 0;
//         this.start.y = 0;
//         this.end.x = 0;
//         this.end.y = 0;
//         this.clearAllKeysState();
//         return this;
//     }

//     setVector(x0, y0, x1, y1) {
//         if (!this.enable) {
//             // Do nothing
//             return this;
//         }

//         if (x0 === null) {
//             // Clear all keys' state
//             this.clearVector();
//             return this;
//         }

//         // (0,0) -> (x0, y0)
//         if (x1 === undefined) {
//             x1 = x0;
//             x0 = 0;
//             y1 = y0;
//             y0 = 0;
//         }

//         this.start.x = x0;
//         this.start.y = y0;
//         this.end.x = x1;
//         this.end.y = y1;

//         if ((this.forceMin > 0) && (this.force < this.forceMin)) {
//             // No key pressed
//             this.clearVector();
//             return this;
//         }

//         // Update keys' state
//         this.noKeyDown = true;
//         var dirStates = AngleToDirections(this.angle, this.dirMode, true);
//         for (var dir in dirStates) {
//             this.setKeyState(dir, dirStates[dir]);
//         }

//         return this;
//     }

//     get forceX() {
//         return this.end.x - this.start.x;
//     }

//     get forceY() {
//         return this.end.y - this.start.y;
//     }

//     get force() {
//         return GetDist(this.start.x, this.start.y, this.end.x, this.end.y);
//     }

//     get rotation() {
//         return GetAngle(this.start.x, this.start.y, this.end.x, this.end.y);
//     }

//     get angle() {
//         return RadToDeg(this.rotation); // -180 ~ 180
//     }

//     get octant() {
//         var octant = 0;
//         if (this.rightKeyDown) {
//             octant = (this.downKeyDown) ? 45 : 0;
//         } else if (this.downKeyDown) {
//             octant = (this.leftKeyDown) ? 135 : 90;
//         } else if (this.leftKeyDown) {
//             octant = (this.upKeyDown) ? 225 : 180;
//         } else if (this.upKeyDown) {
//             octant = (this.rightKeyDown) ? 315 : 270;
//         }
//         return octant;
//     }
// }

// // export default VectorToCursorKeys;

// // const GetValue = Phaser.Utils.Objects.GetValue;
// const CircleClass = Phaser.Geom.Circle;
// const CircleContains = Phaser.Geom.Circle.Contains;

// class TouchCursor extends VectorToCursorKeys {
//     constructor(gameObject, config) {
//         var scene = gameObject.scene;
//         super(scene, config);
//         //this.resetFromJSON(config); // this function had been called in super(config)

//         // Event emitter
//         var eventEmitter = GetValue(config, 'eventEmitter', undefined);
//         var EventEmitterClass = GetValue(config, 'EventEmitterClass', undefined);
//         this.setEventEmitter(eventEmitter, EventEmitterClass);

//         this.scene = scene;
//         this.mainCamera = scene.cameras.main;
//         this.pointer = undefined;
//         this.gameObject = gameObject;
//         this.radius = GetValue(config, 'radius', 100);

//         gameObject.setInteractive(new CircleClass(gameObject.displayOriginX, gameObject.displayOriginY, this.radius), CircleContains);

//         this.boot();
//     }

//     resetFromJSON(o) {
//         super.resetFromJSON(o);
//         this.pointer = undefined;

//         return this;
//     }

//     toJSON() {
//         var o = super.toJSON();
//         o.radius = this.radius;

//         return o;
//     }

//     boot() {
//         this.gameObject.on('pointerdown', this.onKeyDownStart, this);
//         this.gameObject.on('pointerover', this.onKeyDownStart, this);

//         this.scene.input.on('pointermove', this.onKeyDown, this);
//         this.scene.input.on('pointerup', this.onKeyUp, this);

//         this.gameObject.once('destroy', this.onParentDestroy, this);
//     }

//     shutdown(fromScene) {
//         if (!this.scene) {
//             return;
//         }

//         // gameObject events will be removed when this gameObject destroyed 
//         // this.gameObject.off('pointerdown', this.onKeyDownStart, this);
//         // this.gameObject.off('pointerover', this.onKeyDownStart, this);

//         this.scene.input.off('pointermove', this.onKeyDown, this);
//         this.scene.input.off('pointerup', this.onKeyUp, this);

//         this.destroyEventEmitter();

//         this.scene = undefined;
//         this.mainCamera = undefined;
//         this.pointer = undefined;
//         this.gameObject = undefined;

//         super.shutdown();
//     }

//     destroy(fromScene) {
//         this.shutdown(fromScene);
//     }

//     onParentDestroy(parent, fromScene) {
//         this.destroy(fromScene);
//     }

//     onKeyDownStart(pointer) {
//         if ((!pointer.isDown) ||
//             (this.pointer !== undefined)) {
//             return;
//         }
//         this.pointer = pointer;
//         this.onKeyDown(pointer);
//     }

//     onKeyDown(pointer) {
//         if (this.pointer !== pointer) {
//             return;
//         }

//         var camera = pointer.camera;
//         if (!camera) {
//             // Pointer is outside of any camera, no worldX/worldY available
//             return;
//         }

//         // Vector of world position
//         var gameObject = this.gameObject;
//         var worldXY = this.end;

//         // Note: pointer.worldX, pointer.worldY might not be the world position of this camera,
//         // if this camera is not main-camera
//         if (camera !== this.mainCamera) {
//             camera.getWorldPoint(pointer.x, pointer.y, worldXY);
//         } else {
//             worldXY.x = pointer.worldX;
//             worldXY.y = pointer.worldY;
//         }

//         this.setVector(
//             (gameObject.x + camera.scrollX),
//             (gameObject.y + camera.scrollY),
//             worldXY.x,
//             worldXY.y
//         );

//         this.emit('update');
//     }

//     onKeyUp(pointer) {
//         if (this.pointer !== pointer) {
//             return;
//         }
//         this.pointer = undefined;
//         this.clearVector();
//         this.emit('update');
//     }

// }

// Object.assign(
//     TouchCursor.prototype,
//     EventEmitterMethods
// );

// // export default TouchCursor;
// var EventEmitterMethods = {
//     setEventEmitter(eventEmitter, EventEmitterClass) {
//         if (EventEmitterClass === undefined) {
//             EventEmitterClass = Phaser.Events.EventEmitter; // Use built-in EventEmitter class by default
//         }
//         this._privateEE = (eventEmitter === true) || (eventEmitter === undefined);
//         this._eventEmitter = (this._privateEE) ? (new EventEmitterClass()) : eventEmitter;
//         return this;
//     },

//     destroyEventEmitter() {
//         if (this._eventEmitter && this._privateEE) {
//             this._eventEmitter.shutdown();
//         }
//         return this;
//     },

//     getEventEmitter() {
//         return this._eventEmitter;
//     },

//     on: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.on.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     once: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.once.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     off: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.off.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     emit: function (event) {
//         if (this._eventEmitter && event) {
//             this._eventEmitter.emit.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     addListener: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.addListener.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     removeListener: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.removeListener.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     removeAllListeners: function () {
//         if (this._eventEmitter) {
//             this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
//         }
//         return this;
//     },

//     listenerCount: function () {
//         if (this._eventEmitter) {
//             return this._eventEmitter.listenerCount.apply(this._eventEmitter, arguments);
//         }
//         return 0;
//     },

//     listeners: function () {
//         if (this._eventEmitter) {
//             return this._eventEmitter.listeners.apply(this._eventEmitter, arguments);
//         }
//         return [];
//     },

//     eventNames: function() {
//         if (this._eventEmitter) {
//             return this._eventEmitter.eventNames.apply(this._eventEmitter, arguments);
//         }
//         return [];
//     }
// };

// // const GetValue = Phaser.Utils.Objects.GetValue;

// class VirtualJoyStick {
//     constructor(scene, config) {
//         if (config === undefined) {
//             config = {};
//         }

//         // Event emitter
//         var eventEmitter = GetValue(config, 'eventEmitter', undefined);
//         var EventEmitterClass = GetValue(config, 'EventEmitterClass', undefined);
//         this.setEventEmitter(eventEmitter, EventEmitterClass);
//         config.eventEmitter = this.getEventEmitter();

//         this.scene = scene;
//         this.base = undefined;
//         this.thumb = undefined;
//         this.touchCursor = undefined;
//         this.setRadius(GetValue(config, 'radius', 100));

//         this.addBase(GetValue(config, 'base', undefined), config);
//         this.addThumb(GetValue(config, 'thumb', undefined));

//         var x = GetValue(config, 'x', 0);
//         var y = GetValue(config, 'y', 0);
//         this.base.setPosition(x, y);
//         this.thumb.setPosition(x, y);

//         if (GetValue(config, 'fixed', true)) {
//             this.setScrollFactor(0);
//         }

//         this.boot();
//     }

//     destroy() {
//         this.destroyEventEmitter();
//         this.base.destroy(); // Also destroy touchCursor behavior
//         this.thumb.destroy();

//         this.scene = undefined;
//         this.base = undefined;
//         this.thumb = undefined;
//         this.touchCursor = undefined;
//     }

//     createCursorKeys() {
//         return this.touchCursor.createCursorKeys();
//     }

//     get forceX() {
//         return this.touchCursor.forceX;
//     }

//     get forceY() {
//         return this.touchCursor.forceY;
//     }

//     get force() {
//         return this.touchCursor.force;
//     }

//     get rotation() {
//         return this.touchCursor.rotation;
//     }

//     get angle() {
//         return this.touchCursor.angle; // -180 ~ 180
//     }

//     get up() {
//         return this.touchCursor.upKeyDown;
//     }

//     get down() {
//         return this.touchCursor.downKeyDown;
//     }

//     get left() {
//         return this.touchCursor.leftKeyDown;
//     }

//     get right() {
//         return this.touchCursor.rightKeyDown;
//     }

//     get noKey() {
//         return this.touchCursor.noKeyDown;
//     }

//     get pointerX() {
//         return this.touchCursor.end.x;
//     }

//     get pointerY() {
//         return this.touchCursor.end.y;
//     }

//     get pointer() {
//         return this.touchCursor.pointer;
//     }

//     setPosition(x, y) {
//         this.x = x;
//         this.y = y;
//         return this;
//     }

//     set x(x) {
//         this.base.x = x;
//         this.thumb.x = x;
//     }

//     set y(y) {
//         this.base.y = y;
//         this.thumb.y = y;
//     }

//     get x() {
//         return this.base.x;
//     }

//     get y() {
//         return this.base.y;
//     }

//     setVisible(visible) {
//         this.visible = visible;
//         return this;
//     }

//     toggleVisible() {
//         this.visible = !this.visible;
//         return this;
//     }

//     get visible() {
//         return this.base.visible;
//     }

//     set visible(visible) {
//         this.base.visible = visible;
//         this.thumb.visible = visible;
//     }

//     get enable() {
//         return this.touchCursor.enable;
//     }

//     set enable(value) {
//         this.touchCursor.setEnable(value);
//     }

//     setEnable(e) {
//         if (e === undefined) {
//             e = true;
//         }
//         this.enable = e;
//         return this;
//     }

//     toggleEnable() {
//         this.setEnable(!this.enable);
//         return this;
//     }

//     setRadius(radius) {
//         this.radius = radius;
//         return this;
//     }

//     addBase(gameObject, config) {
//         if (this.base) {
//             this.base.destroy();
//             // Also destroy touchCursor behavior
//         }

//         if (gameObject === undefined) {
//             gameObject = this.scene.add.circle(0, 0, this.radius)
//                 .setStrokeStyle(3, 0x0000ff);
//         }

//         this.touchCursor = new TouchCursor(gameObject, config)
//         this.base = gameObject;
//         return this;
//     }

//     addThumb(gameObject) {
//         if (this.thumb) {
//             this.thumb.destroy();
//         }

//         if (gameObject === undefined) {
//             gameObject = this.scene.add.circle(0, 0, 40)
//                 .setStrokeStyle(3, 0x00ff00);
//         }
//         this.thumb = gameObject;
//         return this;
//     }

//     setScrollFactor(scrollFactor) {
//         this.base.setScrollFactor(scrollFactor);
//         this.thumb.setScrollFactor(scrollFactor);
//         return this;
//     }

//     boot() {
//         this.touchCursor.on('update', this.update, this);
//     }

//     update() {
//         var touchCursor = this.touchCursor;
//         // Start from (0,0)
//         var x = this.base.x;
//         var y = this.base.y;
//         if (touchCursor.anyKeyDown) {
//             if (touchCursor.force > this.radius) { // Exceed radius
//                 var rad = touchCursor.rotation;
//                 x += Math.cos(rad) * this.radius;
//                 y += Math.sin(rad) * this.radius;
//             } else {
//                 x += touchCursor.forceX;
//                 y += touchCursor.forceY;
//             }
//         }
//         this.thumb.x = x;
//         this.thumb.y = y
//         return this;
//     }

// }

// Object.assign(
//     VirtualJoyStick.prototype,
//     EventEmitterMethods
// );

// export default VirtualJoyStick;
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).rexvirtualjoystickplugin=e()}(this,function(){"use strict";function h(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function t(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function o(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}function c(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}();return function(){var t,e=a(n);if(r){var i=a(this).constructor;t=Reflect.construct(e,arguments,i)}else t=e.apply(this,arguments);return o(this,t)}}function r(t,e,i){return(r="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,i){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=a(t)););return t}(t,e);if(n){var r=Object.getOwnPropertyDescriptor(n,e);return r.get?r.get.call(i):r.value}})(t,e,i||t)}var u=Phaser.Input.Keyboard.Key,l=Phaser.Input.Keyboard.KeyCodes,e=function(){function e(t){h(this,e),this.cursorKeys={up:new u(t,l.UP),down:new u(t,l.DOWN),left:new u(t,l.LEFT),right:new u(t,l.RIGHT)},this.noKeyDown=!0}return t(e,[{key:"shutdown",value:function(){for(var t in this.cursorKeys)this.cursorKeys[t].destroy();this.cursorKeys=void 0}},{key:"destroy",value:function(t){shutdown(t)}},{key:"createCursorKeys",value:function(){return this.cursorKeys}},{key:"setKeyState",value:function(t,e){var i=this.cursorKeys[t];return i.enabled&&(e&&(this.noKeyDown=!1),i.isDown!==e&&(y.timeStamp=Date.now(),y.keyCode=i.keyCode,e?i.onDown(y):i.onUp(y))),this}},{key:"clearAllKeysState",value:function(){for(var t in this.noKeyDown=!0,this.cursorKeys)this.setKeyState(t,!1);return this}},{key:"getKeyState",value:function(t){return this.cursorKeys[t]}},{key:"upKeyDown",get:function(){return this.cursorKeys.up.isDown}},{key:"downKeyDown",get:function(){return this.cursorKeys.down.isDown}},{key:"leftKeyDown",get:function(){return this.cursorKeys.left.isDown}},{key:"rightKeyDown",get:function(){return this.cursorKeys.right.isDown}},{key:"anyKeyDown",get:function(){return!this.noKeyDown}}]),e}(),y={timeStamp:0,keyCode:0,altKey:!1,ctrlKey:!1,shiftKey:!1,metaKey:!1,location:0},f=180/Math.PI,v={"up&down":0,"left&right":1,"4dir":2,"8dir":3},d={},p=Phaser.Utils.Objects.GetValue,m=Phaser.Math.Distance.Between,b=Phaser.Math.Angle.Between,w=function(){s(r,e);var n=c(r);function r(t,e){var i;return h(this,r),(i=n.call(this,t)).resetFromJSON(e),i}return t(r,[{key:"resetFromJSON",value:function(t){null==this.start&&(this.start={x:0,y:0}),null==this.end&&(this.end={x:0,y:0}),this._enable=void 0,this.setEnable(p(t,"enable",!0)),this.setMode(p(t,"dir","8dir")),this.setDistanceThreshold(p(t,"forceMin",16));var e=p(t,"start.x",null),i=p(t,"start.y",null),n=p(t,"end.x",null),r=p(t,"end.y",null);return this.setVector(e,i,n,r),this}},{key:"toJSON",value:function(){return{enable:this.enable,dir:this.dirMode,forceMin:this.forceMin,start:{x:this.start.x,y:this.start.y},end:{x:this.end.x,y:this.end.y}}}},{key:"setMode",value:function(t){return"string"==typeof t&&(t=v[t]),this.dirMode=t,this}},{key:"enable",get:function(){return this._enable},set:function(t){if(this._enable!==t)return t||this.clearVector(),this._enable=t,this}},{key:"setEnable",value:function(t){return void 0===t&&(t=!0),this.enable=t,this}},{key:"toggleEnable",value:function(){return this.setEnable(!this.enable),this}},{key:"setDistanceThreshold",value:function(t){return t<0&&(t=0),this.forceMin=t,this}},{key:"clearVector",value:function(){return this.start.x=0,this.start.y=0,this.end.x=0,this.end.y=0,this.clearAllKeysState(),this}},{key:"setVector",value:function(t,e,i,n){if(!this.enable)return this;if(null===t)return this.clearVector(),this;if(void 0===i&&(i=t,n=e,e=t=0),this.start.x=t,this.start.y=e,this.end.x=i,this.end.y=n,0<this.forceMin&&this.force<this.forceMin)return this.clearVector(),this;this.noKeyDown=!0;var r=function(t,e,i){switch(void 0===i?i={}:!0===i&&(i=d),i.left=!1,i.right=!1,i.up=!1,i.down=!1,t=(t+360)%360,e){case 0:t<180?i.down=!0:i.up=!0;break;case 1:90<t&&t<=270?i.left=!0:i.right=!0;break;case 2:45<t&&t<=135?i.down=!0:135<t&&t<=225?i.left=!0:225<t&&t<=315?i.up=!0:i.right=!0;break;case 3:22.5<t&&t<=67.5?(i.down=!0,i.right=!0):67.5<t&&t<=112.5?i.down=!0:112.5<t&&t<=157.5?(i.down=!0,i.left=!0):157.5<t&&t<=202.5?i.left=!0:202.5<t&&t<=247.5?(i.left=!0,i.up=!0):247.5<t&&t<=292.5?i.up=!0:(292.5<t&&t<=337.5&&(i.up=!0),i.right=!0)}return i}(this.angle,this.dirMode,!0);for(var s in r)this.setKeyState(s,r[s]);return this}},{key:"forceX",get:function(){return this.end.x-this.start.x}},{key:"forceY",get:function(){return this.end.y-this.start.y}},{key:"force",get:function(){return m(this.start.x,this.start.y,this.end.x,this.end.y)}},{key:"rotation",get:function(){return b(this.start.x,this.start.y,this.end.x,this.end.y)}},{key:"angle",get:function(){return this.rotation*f}},{key:"octant",get:function(){var t=0;return this.rightKeyDown?t=this.downKeyDown?45:0:this.downKeyDown?t=this.leftKeyDown?135:90:this.leftKeyDown?t=this.upKeyDown?225:180:this.upKeyDown&&(t=this.rightKeyDown?315:270),t}}]),r}(),g={setEventEmitter:function(t,e){return void 0===e&&(e=Phaser.Events.EventEmitter),this._privateEE=!0===t||void 0===t,this._eventEmitter=this._privateEE?new e:t,this},destroyEventEmitter:function(){return this._eventEmitter&&this._privateEE&&this._eventEmitter.shutdown(),this},getEventEmitter:function(){return this._eventEmitter},on:function(){return this._eventEmitter&&this._eventEmitter.on.apply(this._eventEmitter,arguments),this},once:function(){return this._eventEmitter&&this._eventEmitter.once.apply(this._eventEmitter,arguments),this},off:function(){return this._eventEmitter&&this._eventEmitter.off.apply(this._eventEmitter,arguments),this},emit:function(t){return this._eventEmitter&&t&&this._eventEmitter.emit.apply(this._eventEmitter,arguments),this},addListener:function(){return this._eventEmitter&&this._eventEmitter.addListener.apply(this._eventEmitter,arguments),this},removeListener:function(){return this._eventEmitter&&this._eventEmitter.removeListener.apply(this._eventEmitter,arguments),this},removeAllListeners:function(){return this._eventEmitter&&this._eventEmitter.removeAllListeners.apply(this._eventEmitter,arguments),this},listenerCount:function(){return this._eventEmitter?this._eventEmitter.listenerCount.apply(this._eventEmitter,arguments):0},listeners:function(){return this._eventEmitter?this._eventEmitter.listeners.apply(this._eventEmitter,arguments):[]},eventNames:function(){return this._eventEmitter?this._eventEmitter.eventNames.apply(this._eventEmitter,arguments):[]}},E=Phaser.Utils.Objects.GetValue,k=Phaser.Geom.Circle,K=Phaser.Geom.Circle.Contains,_=function(){s(u,w);var o=c(u);function u(t,e){var i;h(this,u);var n=t.scene;i=o.call(this,n,e);var r=E(e,"eventEmitter",void 0),s=E(e,"EventEmitterClass",void 0);return i.setEventEmitter(r,s),i.scene=n,i.mainCamera=n.cameras.main,i.pointer=void 0,i.gameObject=t,i.radius=E(e,"radius",100),t.setInteractive(new k(t.displayOriginX,t.displayOriginY,i.radius),K),i.boot(),i}return t(u,[{key:"resetFromJSON",value:function(t){return r(a(u.prototype),"resetFromJSON",this).call(this,t),this.pointer=void 0,this}},{key:"toJSON",value:function(){var t=r(a(u.prototype),"toJSON",this).call(this);return t.radius=this.radius,t}},{key:"boot",value:function(){this.gameObject.on("pointerdown",this.onKeyDownStart,this),this.gameObject.on("pointerover",this.onKeyDownStart,this),this.scene.input.on("pointermove",this.onKeyDown,this),this.scene.input.on("pointerup",this.onKeyUp,this),this.gameObject.once("destroy",this.onParentDestroy,this)}},{key:"shutdown",value:function(){this.scene&&(this.scene.input.off("pointermove",this.onKeyDown,this),this.scene.input.off("pointerup",this.onKeyUp,this),this.destroyEventEmitter(),this.scene=void 0,this.mainCamera=void 0,this.pointer=void 0,this.gameObject=void 0,r(a(u.prototype),"shutdown",this).call(this))}},{key:"destroy",value:function(t){this.shutdown(t)}},{key:"onParentDestroy",value:function(t,e){this.destroy(e)}},{key:"onKeyDownStart",value:function(t){t.isDown&&void 0===this.pointer&&(this.pointer=t,this.onKeyDown(t))}},{key:"onKeyDown",value:function(t){if(this.pointer===t){var e=t.camera;if(e){var i=this.gameObject,n=this.end;e!==this.mainCamera?e.getWorldPoint(t.x,t.y,n):(n.x=t.worldX,n.y=t.worldY),this.setVector(i.x+e.scrollX,i.y+e.scrollY,n.x,n.y),this.emit("update")}}}},{key:"onKeyUp",value:function(t){this.pointer===t&&(this.pointer=void 0,this.clearVector(),this.emit("update"))}}]),u}();Object.assign(_.prototype,g);var D=Phaser.Utils.Objects.GetValue,C=function(){function o(t,e){h(this,o),void 0===e&&(e={});var i=D(e,"eventEmitter",void 0),n=D(e,"EventEmitterClass",void 0);this.setEventEmitter(i,n),e.eventEmitter=this.getEventEmitter(),this.scene=t,this.base=void 0,this.thumb=void 0,this.touchCursor=void 0,this.setRadius(D(e,"radius",100)),this.addBase(D(e,"base",void 0),e),this.addThumb(D(e,"thumb",void 0));var r=D(e,"x",0),s=D(e,"y",0);this.base.setPosition(r,s),this.thumb.setPosition(r,s),D(e,"fixed",!0)&&this.setScrollFactor(0),this.boot()}return t(o,[{key:"destroy",value:function(){this.destroyEventEmitter(),this.base.destroy(),this.thumb.destroy(),this.scene=void 0,this.base=void 0,this.thumb=void 0,this.touchCursor=void 0}},{key:"createCursorKeys",value:function(){return this.touchCursor.createCursorKeys()}},{key:"forceX",get:function(){return this.touchCursor.forceX}},{key:"forceY",get:function(){return this.touchCursor.forceY}},{key:"force",get:function(){return this.touchCursor.force}},{key:"rotation",get:function(){return this.touchCursor.rotation}},{key:"angle",get:function(){return this.touchCursor.angle}},{key:"up",get:function(){return this.touchCursor.upKeyDown}},{key:"down",get:function(){return this.touchCursor.downKeyDown}},{key:"left",get:function(){return this.touchCursor.leftKeyDown}},{key:"right",get:function(){return this.touchCursor.rightKeyDown}},{key:"noKey",get:function(){return this.touchCursor.noKeyDown}},{key:"pointerX",get:function(){return this.touchCursor.end.x}},{key:"pointerY",get:function(){return this.touchCursor.end.y}},{key:"pointer",get:function(){return this.touchCursor.pointer}},{key:"setPosition",value:function(t,e){return this.x=t,this.y=e,this}},{key:"x",get:function(){return this.base.x},set:function(t){this.base.x=t,this.thumb.x=t}},{key:"y",get:function(){return this.base.y},set:function(t){this.base.y=t,this.thumb.y=t}},{key:"setVisible",value:function(t){return this.visible=t,this}},{key:"toggleVisible",value:function(){return this.visible=!this.visible,this}},{key:"visible",get:function(){return this.base.visible},set:function(t){this.base.visible=t,this.thumb.visible=t}},{key:"enable",get:function(){return this.touchCursor.enable},set:function(t){this.touchCursor.setEnable(t)}},{key:"setEnable",value:function(t){return void 0===t&&(t=!0),this.enable=t,this}},{key:"toggleEnable",value:function(){return this.setEnable(!this.enable),this}},{key:"setRadius",value:function(t){return this.radius=t,this}},{key:"addBase",value:function(t,e){return this.base&&this.base.destroy(),void 0===t&&(t=this.scene.add.circle(0,0,this.radius).setStrokeStyle(3,255)),this.touchCursor=new _(t,e),this.base=t,this}},{key:"addThumb",value:function(t){return this.thumb&&this.thumb.destroy(),void 0===t&&(t=this.scene.add.circle(0,0,40).setStrokeStyle(3,65280)),this.thumb=t,this}},{key:"setScrollFactor",value:function(t){return this.base.setScrollFactor(t),this.thumb.setScrollFactor(t),this}},{key:"boot",value:function(){this.touchCursor.on("update",this.update,this)}},{key:"update",value:function(){var t=this.touchCursor,e=this.base.x,i=this.base.y;if(t.anyKeyDown)if(t.force>this.radius){var n=t.rotation;e+=Math.cos(n)*this.radius,i+=Math.sin(n)*this.radius}else e+=t.forceX,i+=t.forceY;return this.thumb.x=e,this.thumb.y=i,this}}]),o}();return Object.assign(C.prototype,g),function(){s(i,Phaser.Plugins.BasePlugin);var e=c(i);function i(t){return h(this,i),e.call(this,t)}return t(i,[{key:"start",value:function(){this.game.events.on("destroy",this.destroy,this)}},{key:"add",value:function(t,e){return new C(t,e)}}]),i}()});