enum ActionKind {
    Walking,
    Idle,
    Jumping,
    Dead
}
namespace SpriteKind {
    export const Ground = SpriteKind.create()
    export const Cloud = SpriteKind.create()
}
function initGround () {
    ground1 = sprites.create(assets.image`ground1`, SpriteKind.Ground)
    ground2 = sprites.create(assets.image`ground1`, SpriteKind.Ground)
    ground1.setPosition(scene.screenWidth() / 2, 120)
    ground2.setPosition(ground1.x + scene.screenWidth(), 120)
    ground1.vx = -100
    ground2.vx = -100
    ground1.z = 2
    ground2.z = 2
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    if (play) {
        if (raptor.y == 94 && end == 0) {
            raptor.vy = -160
            animation.setAction(raptor, ActionKind.Jumping)
        }
    }
})
function initSkateher () {
    raptor = sprites.create(assets.image`skateher`, SpriteKind.Player)
    run = animation.createAnimation(ActionKind.Walking, 100)
    run.addAnimationFrame(assets.image`skateher0`)
    run.addAnimationFrame(assets.image`skateher`)
    animation.attachAnimation(raptor, run)
    jump = animation.createAnimation(ActionKind.Jumping, 200)
    jump.addAnimationFrame(assets.image`skateher-jump`)
    animation.attachAnimation(raptor, jump)
    dead = animation.createAnimation(ActionKind.Dead, 200)
    dead.addAnimationFrame(assets.image`skateher-dead`)
    animation.attachAnimation(raptor, dead)
    raptor.z = 3
    raptor.setPosition(15, 94)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    music.stopAllSounds()
    end = 1
    animation.setAction(raptor, ActionKind.Dead)
    pause(50)
    game.over(false, effects.dissolve)
})
let cloud: Sprite = null
let cactus: Sprite = null
let choice = 0
let dead: animation.Animation = null
let jump: animation.Animation = null
let run: animation.Animation = null
let raptor: Sprite = null
let ground2: Sprite = null
let ground1: Sprite = null
let end = 0
let play = false
let idle = null
play = false
music.play(music.createSong(assets.song`skate-shop`), music.PlaybackMode.LoopingInBackground)
scene.setBackgroundImage(assets.image`igotskate`)
pauseUntil(() => controller.anyButton.isPressed())
music.stopAllSounds()
play = true
scene.setBackgroundImage(assets.image`blank`)
game.setDialogCursor(assets.image`skateher`)
scene.setBackgroundColor(9)
initGround()
initSkateher()
info.setScore(0)
end = 0
game.showLongText("Press any button to ollie.", DialogLayout.Top)
music.play(music.createSong(assets.song`downhill-race`), music.PlaybackMode.LoopingInBackground)
game.onUpdate(function () {
    if (play) {
        if (raptor.y < 94) {
            raptor.ay = 400
        } else {
            raptor.ay = 0
            raptor.y = 94
            if (end == 0) {
                animation.setAction(raptor, ActionKind.Walking)
            }
        }
    }
})
game.onUpdateInterval(50, function () {
    if (play) {
        info.changeScoreBy(1)
    }
})
game.onUpdateInterval(1000, function () {
    if (play) {
        ground1.vx += -1
        ground2.vx += -1
    }
})
game.onUpdateInterval(1000, function () {
    if (play) {
        choice = randint(0, 4)
        if (choice == 0) {
            cactus = sprites.createProjectileFromSide(assets.image`hydrant`, ground1.vx, 0)
            cactus.y = 94
            cactus.z = 2
        } else if (choice == 1) {
            cactus = sprites.createProjectileFromSide(assets.image`cone-large`, ground1.vx, 0)
            cactus.y = 94
            cactus.z = 2
        } else if (choice == 2) {
            cactus = sprites.createProjectileFromSide(assets.image`cones-small`, ground1.vx, 0)
            cactus.y = 94
            cactus.z = 2
        }
    }
})
game.onUpdateInterval(1500, function () {
    if (play) {
        if (Math.percentChance(40)) {
            cloud = sprites.createProjectileFromSide(assets.image`cloud`, ground1.vx / 4, 0)
            cloud.y = randint(20, 60)
            cloud.setKind(SpriteKind.Cloud)
            cloud.z = 1
        }
    }
})
forever(function () {
    if (play) {
        if (ground1.x < -1 * (scene.screenWidth() / 2)) {
            ground1.x = ground2.x + scene.screenWidth()
        }
    }
})
forever(function () {
    if (play) {
        if (ground2.x < -1 * (scene.screenWidth() / 2)) {
            ground2.x = ground1.x + scene.screenWidth()
        }
    }
})
