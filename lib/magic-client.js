import { Magic } from 'magic-sdk';

function createMagicClient() {
  return (
    typeof window !== 'undefined' && 
      new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  );
}

export const magicClient = createMagicClient();
