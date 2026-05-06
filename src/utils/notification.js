export const playNotificationSound = () => {
  try {
    const audio = new Audio("/tingting.mp3");
    audio.volume = 0.7;
    audio.play().catch((err) => {
      console.warn("Could not play notification sound:", err);
    });
  } catch (e) {
    console.error("Error in playNotificationSound:", e);
  }
};
