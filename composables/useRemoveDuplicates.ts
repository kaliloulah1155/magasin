// composables/useRemoveDuplicates.ts
export default function useRemoveDuplicates() {
    /**
     * Remove duplicates from an array of objects based on a specified key
     * @param array - The array from which to remove duplicates
     * @param key - The key to check for duplicates
     * @returns A new array with duplicates removed
     */
    const removeDuplicates = <T, K extends keyof T>(array: T[], key: K): T[] => {
      const seen = new Set();
      return array.filter(item => {
        const keyValue = item[key];
        if (seen.has(keyValue)) {
          return false;
        }
        seen.add(keyValue);
        return true;
      });
    };
  
    return {
      removeDuplicates
    };
  }
  