import { sveltekit } from '@sveltejs/kit/plugins';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Разрешаем Vite читать файлы выше по дереву, если нужно
			allow: ['.']
		}
	}
});