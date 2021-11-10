# To Do
================================================================================
- Change cursor to crosshair instead.
- add weapons and bullet manager/projectile class.
- better ai.
- damage/death/respawn
- better way to handle wall keyup velocity. (i had this done but by integrating into phaser it made it worse.)
- - fixed but now issue when a+d or w+s is back
- figure out is preUpdate should only be used for specific things or what.
- perhaps add seperate event handling for each input event
- remove max_velocity & replace with phasers equivelent.
- better rotation of arms. use a texture maybe
- animation of arms for diff poses such as punch, weapon in hard etc.
- add player collider with item.
- move light to center of player from top left
- move bullet to tip of gun from top left
- normalize bullet dir
- bullet speed currently based on distance from player. fix by normalizing i think.
- bullet destruction
- Constrain reticle to screen or stop locking reticle in screen

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
 

================================================================================
# Ideas
================================================================================
- Glow on enemy sprite radius becomes something like sprite.glow.radius = (cos(time or frame)+1)*sprite.radius;