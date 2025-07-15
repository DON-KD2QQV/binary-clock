document.addEventListener('DOMContentLoaded', () => {
  const hourColumn = document.getElementById('hours');
  const minuteColumn = document.getElementById('minutes');
  const secondColumn = document.getElementById('seconds');
  const digitalClock = document.getElementById('digital-clock');
  const geminiButton = document.getElementById('gemini-button');
  const factContainer = document.getElementById('fact-container');

  const BITS = 6;
  let currentTime = { h: 0, m: 0 };

  function createLights(columnElement) {
    for (let i = 0; i < BITS; i++) {
      const light = document.createElement('div');
      light.classList.add('light', 'w-8', 'h-8', 'md:w-12', 'md:h-12', 'rounded-full', 'bg-gray-700', 'transition', 'duration-200');
      columnElement.appendChild(light);
    }
  }

  function updateColumn(columnElement, onClass, number) {
    const binaryString = number.toString(2).padStart(BITS, '0');
    const lights = columnElement.children;
    for (let i = 0; i < BITS; i++) {
      const light = lights[i];
      const bit = binaryString[BITS - 1 - i];
      light.classList.toggle(onClass, bit === '1');
    }
  }

  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    currentTime = { h, m };

    updateColumn(hourColumn, 'hour-on', h);
    updateColumn(minuteColumn, 'minute-on', m);
    updateColumn(secondColumn, 'second-on', s);

    digitalClock.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function getTimeFact() {
    geminiButton.disabled = true;
    geminiButton.textContent = 'Thinking...';
    factContainer.innerHTML = '<div class="animate-pulse">Fetching a fact from the cosmos...</div>';

    const { h, m } = currentTime;
    const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const prompt = `Tell me a short, interesting, or historical fact related to the time ${timeString}.`;

    try {
      const response = await fetch('timefact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      factContainer.textContent = data.fact || "No fact received.";
    } catch (error) {
      console.error(error);
      factContainer.textContent = "Sorry, I couldn't fetch a fact.";
    } finally {
      geminiButton.disabled = false;
      geminiButton.textContent = 'Get Time Fact ✨';
    }
  }

  createLights(hourColumn);
  createLights(minuteColumn);
  createLights(secondColumn);
  updateClock();
  setInterval(updateClock, 1000);
  geminiButton.addEventListener('click', getTimeFact);
});
