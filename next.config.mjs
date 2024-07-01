import withMDX from '@next/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

const mdxOptions = {
    remarkPlugins: [],
    rehypePlugins: [[rehypePrettyCode, { theme: 'one-dark-pro' }]],
};

const config = withMDX({
    extension: /\.mdx?$/,
    options: mdxOptions,
})({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    webpack(config, options) {
        config.module.rules.push({
            test: /\.mdx?$/,
            use: [
                options.defaultLoaders.babel,
                {
                    loader: '@mdx-js/loader',
                    options: mdxOptions,
                },
            ],
        });

        return config;
    },
});

export default config;
