import {useCallback, useMemo} from 'react';
import {enrichTweet, EnrichedTweet} from 'react-tweet';
import {Box, Flex, Image, Heading, Paragraph, Link, Button, ThemeUICSSObject} from 'theme-ui';

import {useAutoFetch} from '@shared/fe/hook/use-fetch';
import {fetchJson} from '@shared/fe/util/fetch';

import LoadingPlaceholder from 'src/components/basic-ui/loading-placeholder';
import {useTheme} from 'src/contexts/ThemeContext';
import {TokenCatalogType} from 'src/pages/home/components/token-catalog';
import {sharedApiUrl} from 'src/utils/env';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const fontSize = 14;
const lineHeight = 1.4;

type TweetPostCardProps = {
    tweet: EnrichedTweet
    containerSx?: ThemeUICSSObject
};

const fetchTweet = (id: string): Promise<EnrichedTweet | undefined> =>
    fetchJson(`${sharedApiUrl}/api/tweet/${id}`)
        .then(res => res.data ? enrichTweet(res.data) : undefined);

const TweetPostCard = ({
    tweet,
    containerSx
}: TweetPostCardProps) => {
    const {isDarkMode} = useTheme();
    const text = useMemo(() => tweet?.text.slice(tweet.display_text_range[0], tweet.display_text_range[1]), [tweet]);
    const createdAt = useMemo(() => `${tweet?.created_at.slice(0, 10)}`, [tweet]);

    return (
        <Box sx={{width: '100%', ...containerSx}}>
            <Box
                sx={{
                    mt: 50,
                    padding: 4,
                    border: `1px solid ${isDarkMode ? 'rgba(253, 253, 253, 0.10)' : '#e5e7eb'}`,
                    borderRadius: 15,
                    background: isDarkMode ? '#282828' : 'white',
                }}
            >
                <Flex sx={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Flex sx={{justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12px', marginBottom: '20px'}}>
                        <Image
                            src={tweet.user.profile_image_url_https}
                            sx={{borderRadius: '50%', width: 48, height: 48}}
                        />

                        <Box>
                            <Heading
                                as="h3"
                                sx={{lineHeight}}
                            >
                                {tweet.user.name}
                            </Heading>

                            <Paragraph sx={{color: 'textSecondary', lineHeight: 1}}>{createdAt}</Paragraph>
                        </Box>
                    </Flex>
                    <Link
                        href={tweet.url}
                        target="_blank"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <Button
                            variant='claim'
                            sx={{
                                borderRadius: '60px',
                                border: '2px solid rgba(221, 101, 207, 0.15)',
                                background: 'rgba(221, 101, 207, 0.05)',
                                color: '#DD65CF'
                            }}
                        >View the full post</Button>
                    </Link>
                </Flex>

                <Paragraph sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',

                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordWrap: 'break-word',

                    // fallback
                    fontSize: `${fontSize}px`,
                    lineHeight: `${fontSize * lineHeight}px`, /* Set to the height of one line */

                    color: 'text',
                }}
                >
                    {text}
                </Paragraph>
            </Box>
        </Box>
    );
};

const Tweet = ({tokenInfo}: {
  tokenInfo: TokenCatalogType
}) => {
    const {twitterId} = tokenInfo || {};
    const [tweet, , {loading}] = useAutoFetch(useCallback(() => {
        return fetchTweet(twitterId as string);
    }, [twitterId]));

    return (
        <LoadingPlaceholder
            loading={loading}
            sx={{mt: 50, minHeight: '300px'}}
        >
            {
                tweet && (
                    <TweetPostCard
                        tweet={tweet}
                    />
                )
            }

        </LoadingPlaceholder>
    );
};

export default Tweet;
