<template>
	<div class="tmp">
		<canvas id="game-canvas" width="1024" height="600"></canvas>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import Player from "@/Player";
import GameBall from "@/GameBall";

export default Vue.extend({
	name: "Game",
	data() {
		return {
			player: new Player(),
			enemy: new Player(),
			gameBall: new GameBall(),
			controls: {
				arrowUp: false,
				arrowDown: false
			}
		}
	},
	methods: {
		runGame(player: Player, enemy: Player, ball: GameBall, controls: {arrowUp: boolean, arrowDown: boolean}) {
			const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

			const playerWidth = 15;
			const playerMargin = 15;
			const playerHeight = 150;
			const playerStep = 5;
			player.yPosition = Math.round((canvas.height - playerHeight) / 2)
			enemy.yPosition = Math.round((canvas.height - playerHeight) / 2)
			ball.xPosition = Math.round(canvas.width / 2)
			ball.yPosition = Math.round(canvas.height / 2)

			function drawUserRectangle() {
				ctx.rect(playerMargin, player.yPosition, playerWidth, playerHeight);
				ctx.fill();
			}

			function drawEnemyRectangle() {
				ctx.rect(canvas.width - playerWidth - playerMargin, enemy.yPosition, playerWidth, playerHeight);
				ctx.fill();
			}

			function drawBall() {
				ctx.rect(ball.xPosition, ball.yPosition, ball.size, ball.size)
				ctx.fill()
			}

			let fpsInterval: number, now: number, then: number, elapsed: number;
			const fps = 60

			function animate() {
				requestAnimationFrame(animate);
				now = Date.now();
				elapsed = now - then;
				if (elapsed > fpsInterval) {
					then = now - (elapsed % fpsInterval);

					// Calculating positions (needs to be done in server)
					if (ball.xPosition - ball.size < 0)
						ball.angle = Math.PI - ball.angle
					if (ball.xPosition + ball.size > canvas.width)
						ball.angle = Math.PI - ball.angle
					if (ball.yPosition + ball.size > canvas.height)
						ball.angle = -ball.angle
					if (ball.yPosition - ball.size < 0)
						ball.angle = -ball.angle

					ball.xPosition += Math.cos(ball.angle) * ball.speed
					ball.yPosition += Math.sin(ball.angle) * ball.speed
					if (controls.arrowUp && player.yPosition >= playerStep)
						player.yPosition -= playerStep
					if (controls.arrowDown && player.yPosition < canvas.height - playerHeight)
						player.yPosition += playerStep
					enemy.yPosition = ball.yPosition - playerHeight / 2

					// Render
					ctx.clearRect(0, 0, canvas.width, canvas.height)
					ctx.beginPath()
					ctx.fillStyle = '#2c3e50'
					drawUserRectangle()
					drawEnemyRectangle()
					ctx.closePath()

					ctx.beginPath()
					ctx.fillStyle = '#42b983'
					drawBall()
					ctx.closePath()

				}
			}

			fpsInterval = 1000 / fps;
			then = Date.now();
			animate();
		}
	},
	mounted() {
		addEventListener('keydown', (e) => {
			if (e.key === 'ArrowDown')
				this.controls.arrowDown = true
			else if (e.key === 'ArrowUp')
				this.controls.arrowUp = true
		})
		addEventListener('keyup', (e) => {
			if (e.key === 'ArrowDown')
				this.controls.arrowDown = false
			else if (e.key === 'ArrowUp')
				this.controls.arrowUp = false
		})
		this.runGame(this.player, this.enemy, this.gameBall, this.controls)
	}
})
</script>

<style scoped lang="scss">

.tmp {
	height: calc(100vh - 51px);
	display: flex;
	align-items: center;
	justify-content: center;
}

#game-canvas {
	//width: 1024px;
	//height: 600px;
	border: 1px solid #42b983;
	border-radius: 15px;
	//image-rendering: pixelated;
	image-rendering: high-quality;
}

</style>