# To Do: Main
- Items
- Weapons
- Death
- Score
- Enemy Spawning


## To Do: Misc
- Change virus shaders to a spritesheet. Running them as a shader is kinda dumb
- add weapons
    - show weapon in hand.
- better normal ai.
- damage/death/respawn
- figure out is preUpdate should only be used for specific things or what.
- remove max_velocity & replace with phasers equivelent.
- animation of arms for diff poses such as punch, weapon in hard etc.
- add player collider with item.
- move bullet to tip of gun from center
- enemies sit on top of each other
- Change this.getCenter()---->this.body.center; For some things
- Arms are on top of bullet
- camera zoom amount in relation to canvas dimensions
- circle draw AA is bad. using a non-generated texture may look better

## Bugs
- Red Virus
    - Possible error with big red being shot off screen 
    - if big red not on camer in frenzy mode he gets stuck - Note: may have fixed this one.
    - the way red virus frenzy is set in bullet collide is kinda non-intuitive.  Make it better.
    - Clean up the repeated code in Reds move update
- fix window not resizing 
- if enemies closer than gun barrel they are not hit by bullet
- bounding box of initial syringe is huge


# Done
- Bug: Screen goes dark if pointer outside world bounds. issue with lighting im pretty sure.
    - moved light to player position
- Make camera not exit world bounds
- add ~weapons and bullet manager/projectile class.
- normalize bullet dir
- bullet speed currently based on distance from player. fix by normalizing i think.
- arms twitch on move
- Change cursor to crosshair instead.
- Bug: player should stop on escape
- Bug: on collide with world bounds, player moves opposite direction on stop collision.
    - Fix: game expects velocity to reset to 0, but that messes up other stuff. so need to reset to 0 on stop collision. OR need to ignore keyup event while colliding
- Bug: cursor pulls in opposite direction when far away from player
- better way to handle wall keyup velocity. (i had this done but by integrating into phaser it made it worse.)
    - fixed but now issue when a+d or w+s is back
- perhaps add seperate event handling for each input event


# Ideas
================================================================================
- Glow on enemy sprite radius becomes something like sprite.glow.radius = (cos(time or frame)+1)*sprite.radius;
- Enemy waves come in time with song
