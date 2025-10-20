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
          <strong>Numbers</strong> indicate how many <strong class="clair">clair pixels</strong> there are within the
          current pixel and its neighbors (e.g., a <strong class="gray">9</strong> means{' '}
          <strong class="clair">9 clair pixels</strong> in total)
        </p>
        <div class="flex gap-10">
          <p class="clair">
            <responsive-content>
              <span slot="mobile">[TAP]</span>
              <strong slot="desktop">[LEFT CLICK]</strong>
            </responsive-content>{' '}
            to paint a pixel in <strong>clair</strong>
          </p>
          <p class="obscur">
            <responsive-content>
              <span slot="mobile">[LONG TOUCH]</span>
              <strong slot="desktop">[RIGHT CLICK]</strong>
            </responsive-content>{' '}
            to paint a pixel in <strong>obscur</strong>
          </p>
        </div>
      </section>
    </>
  );
};
