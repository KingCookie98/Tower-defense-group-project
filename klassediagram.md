```mermaid
classDiagram
class Tower {
    x
    y
    range
    attack_speed
    shoot()
    findTarget()
    draw()
}


class Enemy {
    x
    y
    hp
    speed
    move()
    draw()
}


class Game {   
    time
    wave
    start_game()

}

class Player {
    hp
    penge
    take_damage()
}

class Map {
    width
    height
    tile_color
    draw()
}

class Projectile {
    x
    y
    damage
    speed
    move()
    draw()
}

class Wave {
    spawn_rate
    monster_types
    time
    penge
    spawn_monsters()
}


Projectile --> Enemy : damages
Game --> Map : controls
Enemy --> Player : attacks
Tower --> Projectile : shoots
Game --> Wave : controls



