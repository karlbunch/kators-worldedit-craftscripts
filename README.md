Kator's MineCraft CraftScripts
==============================

Scripts I've written for minecraft bukkit servers with worldedit installed

You need to have a working copy of Rhino on the server.

Install the scripts in your {minecraft-server-path}/plugins/WorldEdit/craftscripts directory.

If you install in {minecraft-server-path}/plugins/WorldEdit/craftscripts/reponame you can use the 'link' script to make symbolic links to the parent directory so WorldEdit will find the scripts along with other scripts you might already have.

Running the 'link' script will setup a post-merge hook to run it on future updates to make sure new scripts are linked into the parent directory properly.

See: http://wiki.sk89q.com/wiki/WorldEdit/Scripting for details on setting up your server to run craftscripts.

## Installing

Make sure you have the Rhino js.jar in the plugins/WorldEdit directory and have WorldEdit setup properly.

```
cd {minecraft-server-path}/plugins/WorldEdit/craftscripts
git git clone git@github.com:karlbunch/kators-worldedit-craftscripts.git
cd cd kators-worldedit-craftscripts
./link
```

## Updating

You can use:
```
/pull.js
```

To run a git pull on your server.  If this makes you uncomfortable (maybe it should) you should disable this by renaming pull.js to pull.js-disabled.  It won't work unless you have your ssh keys setup and the actual git repo is under your craftscript folder.  The Javascript calls git-pull.sh which is simple enough to audit if you're concerned about security.  For a family server this is not a big deal but could be a big deal if you allow public logins.

See http://wiki.sk89q.com/wiki/WorldEdit/Scripting/Development for documentation on how to write scripts.

## Examples:

### Run a villager census in the selected region

    /census.js [world]

Specify "world" to look at the world's population (only active loaded chunks).
    
### Do a //move and //shift at the same time so the selection stays with the moved region

    /mv.js {args} [ ; {args} ; {args} ...]
    
Example:

    /mv.js 1 n; 1 e

which translates to:

    //move 1 n
    //shift 1 n
    //move 1 e
    //shift 1 e

### Create a pattern in the selected region

    /pattern.js [h] [=blk1[,blk2,...]] <block1> [#x]<block2> [<block3> ... <blockN>]

      Optional args:
        h - horizontal bias to pattern
        =[blk1[,blk2,...] - only replace blocks of blk1[,blk2,...]
        #xBlockid - optional repeat factor for this block
        skip - skip changes to blocks at that point in the pattern
    
### Pattern Examples:

#### Set region to 1 red, 3 green blocks:

    /pattern.js red 3x green

#### Replace with 2 stone, 4 air and 3 wood:

    /pattern.js 2xstone 4x air 3#wood

#### Replace 0,8,9 (air, water, still water) with stonebrick skipping 4 bricks between each:

    /pattern.js =0,8,9 stonebrick 4x skip

### Repeat a sequence of commands

    /repeat.js ## cmd[;cmd;cmd...]

### Repeat examples:

#### Make noise in chat so you can get banned ;-)

    /repeat.js 3 /say Hello; /say Goodbye

#### Calls the pattern.js script 10 times, shifting the current selection down 1 after each call

    /repeat.js 10 /pattern.js =0,8,9 stonebrick 4x skip; //shift 1 d

#### Put torches in the current selection, shift 1 u and do it again

    /repeat.js 5 //set torch;//shift 1 u

#### Zombie attack!

    /repeat.js 15 /spawnmob zombie

