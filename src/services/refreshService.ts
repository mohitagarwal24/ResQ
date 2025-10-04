/**
 * Centralized refresh service to coordinate all contract data refreshes
 * Prevents multiple simultaneous API calls after transactions
 */

interface RefreshCallback {
  id: string;
  callback: () => void | Promise<void>;
  priority: number; // Lower number = higher priority
}

class RefreshService {
  private callbacks: Map<string, RefreshCallback> = new Map();
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;

  /**
   * Register a callback to be called when contract data changes
   */
  register(id: string, callback: () => void | Promise<void>, priority: number = 1) {
    this.callbacks.set(id, { id, callback, priority });
    
    if (import.meta.env.DEV) {
      console.log(`[RefreshService] Registered callback: ${id} (priority: ${priority})`);
    }
  }

  /**
   * Unregister a callback
   */
  unregister(id: string) {
    this.callbacks.delete(id);
    
    if (import.meta.env.DEV) {
      console.log(`[RefreshService] Unregistered callback: ${id}`);
    }
  }

  /**
   * Trigger a coordinated refresh of all registered callbacks
   */
  triggerRefresh() {
    if (this.isRefreshing) {
      if (import.meta.env.DEV) {
        console.log('[RefreshService] Refresh already in progress, skipping...');
      }
      return;
    }

    // Clear any existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Debounce the refresh to avoid rapid successive calls
    this.refreshTimeout = setTimeout(async () => {
      await this.executeRefresh();
    }, 2000); // Single 2-second debounce for all refreshes

    if (import.meta.env.DEV) {
      console.log('[RefreshService] Refresh scheduled in 2 seconds...');
    }
  }

  /**
   * Execute all registered callbacks in priority order
   */
  private async executeRefresh() {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      // Sort callbacks by priority (lower number = higher priority)
      const sortedCallbacks = Array.from(this.callbacks.values())
        .sort((a, b) => a.priority - b.priority);

      if (import.meta.env.DEV) {
        console.log(`[RefreshService] Executing ${sortedCallbacks.length} refresh callbacks...`);
      }

      // Execute all callbacks
      const promises = sortedCallbacks.map(async ({ id, callback }) => {
        try {
          if (import.meta.env.DEV) {
            console.log(`[RefreshService] Executing callback: ${id}`);
          }
          await callback();
        } catch (error) {
          console.error(`[RefreshService] Error in callback ${id}:`, error);
        }
      });

      // Wait for all callbacks to complete
      await Promise.all(promises);

      if (import.meta.env.DEV) {
        console.log('[RefreshService] All refresh callbacks completed');
      }
    } finally {
      this.isRefreshing = false;
      this.refreshTimeout = null;
    }
  }

  /**
   * Clean up any pending timeouts
   */
  cleanup() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    this.callbacks.clear();
  }
}

// Export singleton instance
export const refreshService = new RefreshService();

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    refreshService.cleanup();
  });
}
