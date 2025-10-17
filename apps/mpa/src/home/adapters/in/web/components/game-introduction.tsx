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
          <strong>Numbers</strong> indicate how many{' '}
          <strong class="clair"> clair pixels (white) </strong> surround the current pixel,
          including itself. (e.g. a 9 indicate that<strong class="clair"> 9 clair </strong>pixels
          surround the current pixel)
        </p>
        <div class="flex gap-10">
          <p class="obscur">
            [LEFT CLICK] to paint a pixel in <strong>obscur</strong> (black)
          </p>
          <p class="clair">
            [RIGHT CLICK] to paint a pixel in <strong>clair</strong> (white)
          </p>
        </div>
      </section>
    </>
  );
};
