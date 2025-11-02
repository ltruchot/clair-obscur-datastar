export const GameIntroduction = () => {
  return (
    <>
      <h1>
        <div class="clair">Clair&nbsp;</div>
        <div class="obscur">&nbsp;Obscur</div>
      </h1>
      <h2>
        A collaborative minesweeper game inspired by{' '}
        <a href="https://store.steampowered.com/app/3083300/Proverbs/" target="_blank">
          Proverbs
        </a>
      </h2>
      <section aria-label="Game rules">
        <p class="m-2">
          <span class="pixel-cell">4</span> tell how many <strong class="clair">clair pixels</strong> are within this
          pixel and its 8 neighbors
        </p>
        <p>
          <span class="pixel-cell">9</span> means{' '}
          <span class="clair">
            this pixel and its neighbors are all <strong>clair</strong>
          </span>
        </p>
      </section>
    </>
  );
};
