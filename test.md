This file will breakdown how we tested each element and how to know if it was working. This game is created on Phaser, so it's a very delicate program and it doesn't mix at all with Mocha/Jasmine and other testing frameworks, especially if it was from the react library. Furthermore, creating manual unit tests will not work because if you look at the game's classes, you will realize these aren't normal methods and we know their return object only works if it shows up in the game. Thus we will have to individually find every element we created in the game and make sure it works like we wanted it too, by seeing it in action.

1) Play Game - This is a image button connected to the page with the full game, if you click on it it should lead you to a temporary loading screen then the game, where you see a blue orb with a slingshot. This means your play game works

2) Controls - WASD are the controls with standard movement and shooting is the right click on mouse or just click on the laptop, if you are able to move and shoot then this test passes

3) Lives - If a enemy hits you, then you should respawn with one less life than before, and if you hit 0 lives then the game is over, these are the two scenarios where lives are tested.

4) Shooting - If you are able to shoot needles then the base weapons works, then pick up the shot gun and see if it shoots needles in a more spread out manner, then pick up the machine gun which will shake the map but launch a lot of ammo. If these weapons are able to affect the enemies and the ammo is able to be reduced then it works.

4) Ammo - You start off with infinity but the weakest weapon, so shooting it will have no affect on ammo. Pick up the shotgun and it should have limited ammo but the more shotguns you pick up, then the standard shotgun ammo is added to your current ammo. However when you run out, you will go back to the single needle weapon. Machine gun is also following similar game mechanics, so ammo is added and subtracted then it works

5) Game Progress - It's a percentage value showing how close you are to finishing the game, the current win is set at 95000 without a multiplier, so it's just your current score divided by 95000 times 100, if that number matches the percentage in the game, it works

6) Sound - There is a sound that will play during the game and it will get more intense as it gets harder, furthermore there is a loss sound which will trigger once you lose all your lives, signaling game over. Finally we have a dora song that plays once you won the game, which is reaching 95000 without a multiplier

7) Score - The score you see is the points you get for destroying enemy cells and each enemy should have a different point Red giving 500 points, green getting 100 points and blue getting 300 points. Once you reach 95000 without dying the game is over, and the score shown at the end of the game is multiplied by the amount of lives you had, thus if you win using 0 lives then it's 95000 * 4, which is the perfect game

8) Red Enemy - It's the hardest enemy in the game because it takes a lot of bullets to destroy and also it moves very fast across the screen, so if you see it zooming past you and/or hitting you, then you know it's working well. It doesn't spawn as often as rest

9) Blue Enemy - It's a slower enemy but it will give you 300 points after destroying and it spawns more than the red enemy but less than the green, and it's also one bit away from removing your life.

10) Green Enemy - It's the most common enemy and it's going to spawn frequently. They only offer 100 points and it's mostly there to keep the player honest and if he makes a mistake this enemy will take a life.

11) Item Drops - There will be random weapons dropped after disposing off an enemy and these are specifically the machine gun and shotgun. It's randomized so trying to test for it isn't possible but if you don't find one within the first 2000 points, then something is wrong.

12) Loser End Screen - When your lives are over, the game should automatically send you to the end screen with the final score which is the score from when you were playing the game. Also gives you the option of restarting, if you restart, then the game will begin again with the same rules. Main Menu will lead you to the main title screen of the game.

13) Background screen - The background is an animated patient on a hospital bed, with the heart blinking bright red, as it symbolizes the dangers of having covid. It has outerbounds but the map is very big and allows for more space to maneuver

14) Animations - When you destroy a enemy cell or you get destroyed, the ballon should pop, so if this works then the animation test works

15) Credits - This is the page where we had to give credit for all the sounds and images we used, so that the game doesn't get sued

16) Spawning - The spawning of the enemies are random but it's meant to be close to where the user is and also they will come to whatever location you are, thus if the spawning and tracking of enemies are working, then they are coming only for you.

17) Random - There are a lot of random spawning, item drops, and attacks thus we have created random functions in the math.js which creates those methods we will use in other classes, thus if any of those in game attributes aren't spawning randomly that means there is an issue with the randomizing.

We created a lot of tests in mocha initially however as we changed the game mechanics, the tests weren't usable as Phaser doesn't mix with other frameworks even testing ones. Furthermore, TDD isn't possible since this was a project we started with no legacy code and it's a single player game, so not many games could be tested and the easiest to tell if a method was working was to see if that function worked in game, as we didn't create anything that won't be used. So it was more BDD, than TDD. After deployment, we tested glitches and other problems by simply playing the game as it is the most efficient ways to show bugs and we made improvements through that. Each of these elements I talked about in the game should function as listed above and if it doesn't that means the test didn't pass, and needs to be improved, however our game doesn't have anything failing now.