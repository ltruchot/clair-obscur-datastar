export const GameIntroduction = () => {
  return (
    <>
      <h2>
        A collaborative minesweeper game inspired by{' '}
        <a href="https://store.steampowered.com/app/3083300/Proverbs/" target="_blank">
          Proverbs
        </a>
      </h2>
      <section aria-label="Game rules">
        <p class="m-2">
          Mark numbered pixels like <span class="pixel-cell">3</span> as <strong class="clair">clair</strong> or{' '}
          <strong class="obscur">obscur</strong>
        </p>
        <p class="m-2">
          <span class="pixel-cell">4</span> is <strong class="clair">4 clairs</strong> among the 9 (itself + 8
          neighbors)
        </p>
        <p>
          <span class="pixel-cell">9</span> means <strong class="clair">9 clairs</strong>, while{' '}
          <span class="pixel-cell">0</span> means <strong class="obscur">9 obscurs</strong>
        </p>
      </section>
    </>
  );
};
