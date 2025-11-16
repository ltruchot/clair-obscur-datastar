export const GameIntroduction = () => {
  return (
    <>
      <section aria-label="Game rules" class="mb-10">
        <p>
          Mark numbered pixels like <span class="pixel-cell">3</span> as <strong class="clair">clair</strong> or{' '}
          <strong class="obscur">obscur</strong>
        </p>
        <p>
          <span class="pixel-cell">4</span> means <strong class="clair">4 clairs</strong> among the 9: self + 8
          neighbors
        </p>
        <p>
          <span class="pixel-cell">9</span> means <strong class="clair">9 clairs</strong>, while{' '}
          <span class="pixel-cell">0</span> means <strong class="obscur">9 obscurs</strong>
        </p>
        <p>
          <span class="pixel-cell cell-transparent"></span> Empty and colored pixels do not count at all
        </p>
      </section>
    </>
  );
};
