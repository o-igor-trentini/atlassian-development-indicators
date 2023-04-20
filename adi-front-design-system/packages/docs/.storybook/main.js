module.exports = {
    stories: ['../src/pages/**/*.stories.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-mdx-gfm',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    features: {
        storyStoreV7: true,
    },
    // viteFinal: (config, { configType }) => {
    //   // TODO: Configurar URL para produção
    //   if (configType === "PRODUCTION") config.base = "/{URL}/";
    //
    //   return config;
    // },
    docs: {
        autodocs: true,
    },
};
