This file will breakdown how we tested each element and how to know if it was working. 
This game is created on Phaser, so it's a very delicate program and it doesn't mix 
at all with Mocha/Jasmine and other testing frameworks, especially if it was from the 
react library. Furthermore, creating manual unit tests will not work because if you 
look at the game's classes, you will realize these aren't normal methods and we know 
their return object only works if it shows up in the game. Thus we will have to 
individually find every element we created in the game and make sure it works like we 
wanted it too, by seeing it in action.

1) Play Game - This is a image button connected to the page with the full game, 
if you click on it it should lead you to a loading screen that is shown 
during the preload section of the game scene, once finished you are shown the game 
where you first see a blue circle with a slingshot. This means your play game works.
    ```
    - Structure: Play Button->Launch Game Scene
        - Game Scene: Preload (load assets) -> Create (create and place initial game objects) -> Update (game loop)
    ```

2) Controls: If all of these work this test passes.
    ```
    - Computer: 
        - WASD/Arrow Keys are the controls for standard movement. Shooting is done with a right mouse click.  
    - Mobile: 
        - Bottom left corner Joystick & tap for direction and to shoot.
    ``` 

3) Lives - If a enemy hits you, then you should respawn with one less life than 
before, and if you hit 0 lives then the game should fade to black in 6 seconds 
along with the music. After complete, the gameover scene is launched a second later.

4) Shooting - If you are able to shoot vaccines then the base weapons works, then 
pick up the shot gun and see if it shoots vaccines in a more spread out manner, 
then pick up the machine gun which will shake the map but launch a lot of ammo. 
If these weapons are able to affect the enemies and the ammo is able to be 
reduced then it works.
    ```
    - State: Hold shoot with machine gun, 
    - Action: get killed (dont let go), 
    - Result: you should not be shooting anymore.
    
    - State: Hold weapon, 
    - Action: get killed and try to shoot, 
    - Result: you should not be able to shoot.

    - State: Hold weapon thats not slingshot, 
    - Action: Shoot, 
    - Result: Ammo decrement.
    ```
5) Ammo - You start off with infinite but the weakest weapon, so shooting it 
will have no affect on ammo. Pick up the shotgun and it should have limited ammo 
but the more shotguns you pick up, then the standard shotgun ammo is added to your 
current ammo. However when you run out, you will go back to the single needle weapon. 
Machine gun is also following similar game mechanics, so ammo is added and subtracted 
then it works
    ```
    - State: Hold not slingshot, 
    - Action: Pick up another, 
    - Result: weapon ammo incremented and fade text is spawned.

    - State: Hold not slingshot, 
    - Action: Shoot until zero ammo, 
    - Result: Weapon switched to slingshot.
    ```


6) Game Progress - (score wise) It's a percentage value showing how close you are to finishing 
the game, the current win is set at 95000 without a multiplier, so it's just your 
current score divided by 95000 times 100, if that number matches the percentage 
in the game, it works. (progression wise) more enemies are spawned starting at score 1000,
or double current enemies (green spawned every 10 secs). Each time the score or enemies double,
we move to the next state and double the threshold requirement for the next state.


7) Sound - Music is played during the game and it will get more 
intense as it gets harder, furthermore there is a loss sound which will trigger 
once you lose all your lives, signaling game over. Finally we have a dora song 
that plays once you won the game, which is reaching 95000 without a multiplier.
Other sounds include: green/blue death, red death, item pickup, individual weapon fire, win screen.
The two looping songs win and game music are susceptible to bugs (playing over each other)
when played through multiple times without refreshing the page, so make sure to handle 
destruction, stopping the music, or a global music state.
    ```
    - State: Next progress event, 
    - Action: multiply heart rate by arbitrary 1.5 and increment song rate by ((Song normal speed)-(song start speed))/(base number of events)
    - Result: speed of heart and song pick up.
    ```

8) Score - The score you see is the points you get for destroying enemy cells and 
each enemy should have a different point Red giving 500 points, green getting 100 
points and blue getting 300 points. Once you reach 95000 without dying the game is 
over, and the score shown at the end of the game is multiplied by the amount of 
lives you had, thus if you win using 0 lives then it's 95000 * 4, which is the 
perfect game

9) Red Enemy (the brute) - It's the hardest enemy in the game due to its frenzy mode and 
invulnerability while resting. It has 2 main states.
    ```
    - 2 HP: same as over viruses
    - 1 HP: Frenzy mode.
        a) On start, wait some time with invulnerability.
        b) After time, dash at enemy (vulnerable).
        c) Once hit Camera or world bound wall (low velocity), Stop and return to state a.
    ```

10) Blue Enemy (the sponge) - A slower enemy, that has 3 HP. After each hit, the size of the blue
enemy grows by a bit. Worth 300 points. The main point is to make you waste your ammo. 
It spawns more than the red enemy but less than the green, and it's also one bit 
away from removing your life.

11) Green Enemy (the fodder) - It's the most common enemy and spawns every 10 
seconds even without meeting a next game stage event. They offer 100 points and 
it's mostly there to act as fodder and get in your way against the real threats.

12) Item Drops - There are only 4 items on the ground at a time that that are randomly 
dropped with a 50% chance (with the shotgun spawning more often than the machine gun) 
after disposing off an enemy. If they arent appearing or there is more than 4, 
then somthing is wrong.

13) Game Over Screen - When your lives are over, the game should automatically 
send you to the end screen with the final score which is the score from when you 
were playing the game. Also gives you the option of restarting, if you restart, 
then the game will begin again with the same rules. Main Menu will lead you to 
the main title screen of the game. No leftover objects or states should appear 
when restarting such as music, or lights from drops. It is easy to miss these bugs
as sometimes you have to play 2-3 times through for them to appear.

14) Background screen - The background is an animated patient on a hospital bed, 
with the heart blinking bright red, as it symbolizes the dangers of having covid. 
It has outerbounds but the map is very big and allows for more space to maneuver.
    ```
    The background is composed of 2 textures. The first being the color and the 
    second being a normal map which gives the image its 3D and textured look in 
    the light and shadows. Phaser handles most of this for you. But beware phaser 
    has a bug that causes a scene to go black if no light is on the screen. 
    ```


15) Tweens & Particles - A Tween is phaser object that allows you to cause an effect over a set period 
of time in one call instead of having to update the object yourself in every step 
to cause an effect. A particle object lets you create a temporary animation composed of multiple textures.
The current tweens are:
    ```
    - Score/Ammo Fade.
    - Music Fade.
    - Heart beat radius.
    - Blue Enemy Growth
    - Player blink-in respawn.
    ```

    The current particles are: 
    ```
    - Player Destruction
    ```
    
16) Credits - This is the page where we had to give credit for all the sounds 
and images we used, so that the game doesn't get in trouble for copyright 
infringement and to list those who worked on it. Credits, links to sources, and 
licenses are listed in data/licenses.txt.


17) Spawning - Enemies are randomly spawned on the outside edge of the world offscreen. 
Enemies always target towards the player unless dead/respawning.


18) Random - There is a lot of random spawning, item drops, and attacks thus we 
have created random functions in the math.js which creates those methods we will 
use in other classes. It primarily uses the function TossCoin to return true/false
with a chance. 

We created a lot of tests in mocha initially however as we changed the game 
mechanics, the tests weren't usable as Phaser doesn't mix with other frameworks 
even testing ones. Furthermore, TDD isn't possible since this was a project we 
started with no legacy code and it's a single player game, so not many games 
could be tested and the easiest to tell if a method was working was to see if 
that function worked in game, as we didn't create anything that won't be used. 
So it was more BDD, than TDD. After deployment, we tested glitches and other 
problems by simply playing the game as it is the most efficient ways to show 
bugs and we made improvements through that. Each of these elements I talked 
about in the game should function as listed above and if it doesn't that means 
the test didn't pass, and needs to be improved, however our game doesn't have 
anything failing now.