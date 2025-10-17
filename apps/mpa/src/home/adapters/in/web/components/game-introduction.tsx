export const GameIntroduction = () => {
  return (
    <>
      <h1>
        <span class="clair">Clair&nbsp;</span>
        <span class="obscur">&nbsp;Obscur</span>
      </h1>
      <h2>
        A collaborative minesweeper game inspired by{' '}
        <a href="https://store.steampowered.com/app/3083300/Proverbs/" target="_blank">
          Proverbs
        </a>
      </h2>
      <section aria-label="Game rules">
        <p>
          <strong>Numbers</strong> indicate how many
          <strong class="clair">clair pixels</strong> surround the current pixel, including itself.
          (e.g. a <strong class="gray">9</strong> indicates that{' '}
          <strong class="clair">9 clair pixels</strong> surround the current pixel)
        </p>
        <div class="flex gap-10">
          <p class="obscur">
            <strong>[LEFT CLICK]</strong> to paint a pixel in <strong>obscur</strong>
          </p>
          <p class="clair">
            <strong>[RIGHT CLICK]</strong> to paint a pixel in <strong>clair</strong>
          </p>
        </div>
      </section>
    </>
  );
};
