<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  export const color = writable([0xFF, 0, 0])

  const width = 330;
  const height = 330;

  const area = {
    color: $color,
    x: 16,
    y: 16,
    width: width - 80,
    height: height - 32,
  };
  const strip = {
    x: width - 48,
    y: 16,
    width: 32,
    height: height - 32,
  };

  let canvas;
  let ctx;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    {
      ctx.save();
      const {
        x,
        y,
        width,
        height,
      } = area;
      ctx.translate(x, y);
      ctx.fillStyle = `rgb(${area.color})`;
      ctx.fillRect(0, 0, width, height);

      const grdWhite = ctx.createLinearGradient(0, 0, width, 0);
      grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
      grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grdWhite;
      ctx.fillRect(0, 0, width, height);

      const grdBlack = ctx.createLinearGradient(0, 0, 0, height);
      grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
      grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = grdBlack;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    {
      ctx.save();
      const {
        x,
        y,
        width,
        height,
      } = strip;
      ctx.translate(x, y);
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      [
        '255,0,0',
        '255,0,255',
        '0,0,255',
        '0,255,255',
        '0,255,0',
        '255,255,0',
        '255,0,0',
      ].forEach((color, i) => {
        grd.addColorStop(Math.min(0.17 * i, 1), `rgb(${color})`);
      });
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  };

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw();
  });

  export const update = (rgb) => {
    area.color = rgb;
    $color = rgb;
    if (ctx) {
      draw();
    }
  };

  let isPicking = false;
  const onMouseMove = ({ clientX, clientY }) => {
    if (!isPicking) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const pointer = {
      x: ((clientX - rect.left) / (rect.right - rect.left)) * width,
      y: ((clientY - rect.top) / (rect.bottom - rect.top)) * height,
    };
    for (let i = 0; i < 2; i += 1) {
      const {
        x,
        y,
        width,
        height,
      } = i === 0 ? area : strip;
      if (
        pointer.x >= x
        && pointer.x <= x + width
        && pointer.y >= y
        && pointer.y <= y + height
      ) {
        const imageData = ctx.getImageData(pointer.x, pointer.y, 1, 1).data;
        if (i === 0) {
          $color = [
            imageData[0],
            imageData[1],
            imageData[2]
          ];
        } else {
          area.color = [
            imageData[0],
            imageData[1],
            imageData[2]
          ];
          draw();
        }
        break;
      }
    }
  };
  const onMouseDown = (e) => {
    isPicking = true;
    onMouseMove(e);
  };
  const onMouseUp = () => {
    isPicking = false;
  };

  let pallete = [...Array(8)].map((v, i) => (
    i > 0 ? [0, 0, 0] : $color
  ));

  $: if (
    !isPicking
    && $color !== pallete[0]
    && !pallete.find(([r, g, b]) => (
      $color[0] === r
      && $color[1] === g
      && $color[2] === b
    )) 
  ) {
    pallete = [
      $color,
      ...pallete.slice(0, pallete.length - 1)
    ];
  }
</script>

<svelte:window on:blur={onMouseUp} on:mouseup={onMouseUp} />

<canvas
  bind:this={canvas}
  width={width}
  height={height}
  on:mousedown={onMouseDown}
  on:mousemove={onMouseMove}
/>

<pallete>
  {#each pallete as color}
    <color
      style="background: rgb({color.join(',')})"
      on:click={() => update(color)}
    />
  {/each}
</pallete>

<style>
  canvas {
    display: block;
    background: #000;
    border: 8px solid #222;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  pallete {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  color {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin: 0 0.25rem;
    border: 1px solid #222;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  }
</style>
