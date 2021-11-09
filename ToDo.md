# To Do
================================================================================
- Change cursor to crosshair instead.
- add weapons and bullet manager/projectile class.
- better ai.

================================================================================
# Bugs
================================================================================
- Bug: player should stop on escape
-- Replicate: hold key to move & press escape key
- Bug: on collide with world bounds, player moves opposite direction on stop collision.
-- Fix: game expects velocity to reset to 0, but that messes up other stuff. so need to reset to 0 on stop collision. OR need to ignore keyup event while colliding
- Bug: cursor pulls in opposite direction when far away from player


================================================================================
# Done
================================================================================
- Bug: Screen goes dark if pointer outside world bounds. issue with lighting im pretty sure.
-- moved light to player position
- Make camera not exit world bounds