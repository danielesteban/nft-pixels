<script>
  import { onMount } from 'svelte';
  import { account, mint } from '../services/contract';
  import ColorPicker from '../components/colorpicker.svelte';

  // This should prolly scale with the viewport
  // But for now it's just scaled for a 1080p desktop browser
  const size = { x: 16, y: 16 };
  const scale = { x: 32, y: 48 };
  const pixels = [...window.crypto.getRandomValues(new Uint32Array(size.x*size.y))].map((n) => {
    const l = ((n >> 24) & 0xFF) / 0xFF;
    return [
      Math.floor(((n >> 16) & 0xFF) * l),
      Math.floor(((n >> 8) & 0xFF) * l),
      Math.floor((n & 0xFF) * l),
    ];
  });
  let color;
  let pick;
  let showGrid = false;
  let tool = 'paint';
  $: if ($color) tool = 'paint';

  let canvas;
  let ctx;
  let grid;

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    for (let i = 0, y = 0; y < size.y; y += 1) {
      for (let x = 0; x < size.x; x += 1, i += 1) {
        const [r, g, b] = pixels[i];
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(
          x * scale.x, y * scale.y,
          scale.x, scale.y
        );
      }
    }
    {
      const ctx = grid.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.strokeStyle = 'rgb(25, 25, 25, 0.5)';
      for (let i = 0, y = 0; y < size.y; y += 1) {
        for (let x = 0; x < size.x; x += 1, i += 1) {
          ctx.strokeRect(
            x * scale.x, y * scale.y,
            scale.x, scale.y
          );
        }
      }
    }
  });

  let isDrawing = false;
  let isMinting = false;
  const onMouseMove = ({ clientX, clientY }) => {
    if (!isDrawing || isMinting) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / (rect.right - rect.left) * canvas.width) / scale.x);
    const y = Math.floor(((clientY - rect.top) / (rect.bottom - rect.top) * canvas.height) / scale.y);
    const i = (size.x * y) + x;
    switch (tool) {
      default: {
        pixels[i] = $color;
        ctx.fillStyle = `rgb(${$color.join(',')})`;
        ctx.fillRect(
          x * scale.x, y * scale.y,
          scale.x, scale.y
        );
        break;
      }
      case 'pick': {
        isDrawing = false;
        pick(pixels[i]);
        break;
      }
    }
  };
  const onMouseDown = (e) => {
    isDrawing = true;
    onMouseMove(e);
  };
  const onMouseUp = () => {
    isDrawing = false;
  };

  const onMint = () => {
    isMinting = true;
    mint({ account: $account, pixels })
      .then(() => {
        document.location.hash = '#/';
      })
      .catch(() => {
        isMinting = false;
      })
  };
</script>

<svelte:window on:blur={onMouseUp} on:mouseup={onMouseUp} />

<creator>
  <half>
    <pixels>
      <canvas
        bind:this={canvas}
        width={size.x * scale.x}
        height={size.y * scale.y}
        on:mousedown={onMouseDown}
        on:mousemove={onMouseMove}
      />
      <canvas
        class="grid"
        class:visible={showGrid}
        bind:this={grid}
        width={size.x * scale.x}
        height={size.y * scale.y}
      />
    </pixels>
  </half>
  <half>
    {#if isMinting}
      Minting PixelsToken...
    {:else}
      <div>
        <tools>
          <color
            style={$color ? `background: rgb(${$color.join(',')})` : ''}
          />
          <button
            class:primary={tool === 'paint'}
            on:click={() => { tool = 'paint'; }}
          >
            Paint
          </button>
          <button
            class:primary={tool === 'pick'}
            on:click={() => { tool = 'pick'; }}
          >
            Pick
          </button>
          <label>
            <input
              type="checkbox"
              bind:checked={showGrid}
            />
            Show grid
          </label>
        </tools>
        <ColorPicker
          bind:color={color}
          bind:update={pick}
        />
        <actions>
          <button
            class:primary={$account}
            disabled={!$account}
            on:click={onMint}
          >
            Mint pixels
          </button>
        </actions>
      </div>
    {/if}
  </half>
</creator>

<style>
  creator {
    display: flex;
    justify-content: center;
    min-height: 100%;
  }

  pixels {
    position: relative;
    background: #000;
    border: 8px solid #222;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  canvas {
    display: block;
  }

  canvas.grid {
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  canvas.grid.visible {
    display: block;
  }

  half {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: top;
    width: 50%;
    max-width: 700px;
    box-sizing: border-box;
    padding: 3rem 1rem;
  }

  color {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  }

  tools, actions {
    width: 100%;
    display: flex;
    align-items: center;
  }

  tools {
    margin: 1rem 0;
  }

  tools > button, tools > color {
    margin: 0 0.25rem;
  }

  tools > label {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
  
  tools > label > input {
    margin-right: 0.5rem;
  }

  actions {
    margin: 4rem 0 2rem;
    justify-content: center;
  }

  actions > button {
    width: 100%;
    padding: 1rem 0;
    font-size: 1.4rem;
  }
</style>
