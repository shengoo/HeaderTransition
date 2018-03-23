import React, {Component} from 'react';
import {
    Animated,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    Image,
} from 'react-native';

const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 64;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
        };
    }

    _renderScrollViewContent() {
        const data = Array.from({length: 30});
        return (
            <View style={styles.scrollViewContent}>
                {data.map((_, i) => (
                    <View key={i} style={styles.row}>
                        <Text>{i}</Text>
                    </View>
                ))}
            </View>
        );
    }

    render() {
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        //
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const headerHeight = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });

        //图片变成透明的
        const imageOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        //图片跟随滚动，但是是滚动距离的一般
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, HEADER_SCROLL_DISTANCE / 2],
            extrapolate: 'clamp',
        });
        //标题颜色
        const titleColor = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: ['#fff', '#000'],
            extrapolate: 'clamp',
        });

        //头像大小
        const avatarSize = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [80, 24],
            extrapolate: 'clamp',
        });
        //头像圆角
        const avatarBorderRadius = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 12],
            extrapolate: 'clamp',
        });
        //头像移动距离
        const avatarTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [-80, 0],
            extrapolate: 'clamp',
        });

        const titleTranslateX = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [-40, 0],
            extrapolate: 'clamp',
        });


        return (
            <View style={styles.fill}>
                <StatusBar
                    barStyle="dark-content"
                />
                <Animated.ScrollView
                    style={styles.fill}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                    )}
                    contentInset={{
                        top: HEADER_MAX_HEIGHT,
                    }}
                    contentOffset={{
                        y: -HEADER_MAX_HEIGHT,
                    }}
                >
                    {this._renderScrollViewContent()}
                </Animated.ScrollView>
                <Animated.View
                    style={[
                        styles.header,
                        {transform: [{translateY: headerTranslate}]},
                    ]}
                >
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                opacity: imageOpacity,
                                transform: [{translateY: imageTranslate}],
                            },
                        ]}
                        source={require('./assets/cat.jpg')}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            height: headerHeight,
                        },
                    ]}
                >
                    <Animated.Image style={[
                        {width: avatarSize, height: avatarSize, borderRadius: avatarBorderRadius,},
                        {
                            transform: [
                                {translateX: avatarTranslate},
                            ],
                        },
                    ]} source={require('./assets/avatar.jpg')}/>
                    <Animated.Text style={[
                        styles.title,
                        {
                            color: titleColor,
                            transform: [
                                {translateX: titleTranslateX},
                                // {translateY: titleTranslateY},
                            ],
                        }
                    ]}>My Name</Animated.Text>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f5f5f6',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        // backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C7CB',
    },
    title: {
        // color: 'white',
        color: '#191A1C',
        marginLeft: 8,
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
