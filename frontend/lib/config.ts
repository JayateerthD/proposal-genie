interface AppConfig {
  useMockData: boolean;
  apiBaseUrl: string;
  api: {
    mockDelay: number;
  };
  mockDelay: {
    min: number;
    max: number;
  };
  uploadSimulation: {
    chunkDelay: number;
    progressSteps: number;
    failureRate: number; // 0-1 probability of failure for testing
  };
  aiChatSimulation: {
    typingDelay: number;
    responseDelay: number;
  };
}

export const config: AppConfig = {
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || true,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  api: {
    mockDelay: 800
  },
  mockDelay: {
    min: 500,  // Minimum delay in ms
    max: 2000  // Maximum delay in ms
  },
  uploadSimulation: {
    chunkDelay: 100,      // Delay between progress updates
    progressSteps: 20,    // Number of progress steps
    failureRate: 0.1      // 10% chance of failure for testing
  },
  aiChatSimulation: {
    typingDelay: 50,      // Delay per character when "typing"
    responseDelay: 1000   // Base delay before response
  }
};

export default config;

// Helper functions
export const getRandomDelay = () => {
  const { min, max } = config.mockDelay;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shouldSimulateFailure = () => {
  return Math.random() < config.uploadSimulation.failureRate;
};

export const simulateProgress = (
  callback: (progress: number) => void,
  duration: number = 2000
): Promise<void> => {
  return new Promise((resolve) => {
    const steps = config.uploadSimulation.progressSteps;
    const stepDelay = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = Math.min(100, (currentStep / steps) * 100);
      callback(progress);

      if (progress >= 100) {
        clearInterval(interval);
        resolve();
      }
    }, stepDelay);
  });
};

export const simulateTyping = (
  text: string,
  callback: (partial: string) => void
): Promise<void> => {
  return new Promise((resolve) => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      callback(text.substring(0, currentIndex));

      if (currentIndex >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, config.aiChatSimulation.typingDelay);
  });
};