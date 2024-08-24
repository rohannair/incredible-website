<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let x: number;
  export let y: number;
  export let size: number;
  export let opacity: number;
  export let rotation: number;
  export let isStatic: boolean;
  export let particleIcon: string;
  export let staticIcon: string;
  export let index: number;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch("toggleState", index);
  }
</script>

<button
  on:click={handleClick}
  on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  }}
  style="position: absolute;
         left: {x}px;
         top: {y}px;
         width: {size}px;
         height: {size}px;
         opacity: {opacity};
         transform: rotate({isStatic ? 0 : rotation}deg);
         cursor: pointer;
         background: none;
         border: none;
         padding: 0;
         transition: all 0.3s ease;"
  aria-label={isStatic ? "Static particle" : "Moving particle"}
>
  <img
    src={isStatic ? staticIcon : particleIcon}
    alt=""
    style="width: 100%; height: 100%; object-fit: cover;"
  />
</button>
