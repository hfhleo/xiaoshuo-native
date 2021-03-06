import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    FlatList,
    Image,
    ImageBackground,
    Button,
    TouchableOpacity,
    Platform,
    TouchableHighlight
} from 'react-native';
import RNFS from 'react-native-fs';
import CookieManager from "react-native-cookies";

import px from '../util/px';
import {connect} from 'react-redux';
import * as actions from '../store/actions/publics';

class DrawerPage extends Component {
    doState=()=>{
        console.log(this.props)
        if(this.props.publics.isLogin) return false;
        //未登陆则登陆，
        this.props.dwData.navigation.navigate("Login");
    }
    upYundata=()=>{
        if(!this.props.publics.isLogin){
            alert('未登录！');
            return false;
        }
        // 获取某个key下的所有数据(仅key-id数据)
        storage.getAllDataForKey('bookInfo').then(users => {
            let arr = [];
            for(let i=0;i<users.length;i++){
                let narr = users[i];
                delete narr.pageList;
                delete narr.authorBooks;
                delete narr.commentCon;
                console.log(narr)
                //如果不是书架内容,直接删除内容
                if(narr.isAdd){
                    arr.push(narr)
                }
            }
            this.props._upYundata(arr, this.props.publics.uid);
        }).catch(err => {
            console.log(err);
        });
    }
    dlYundata=()=>{
        if(!this.props.publics.isLogin){
            alert('未登录！');
            return false;
        }
        //判断登陆状态，发送用户id
        let uid = this.props.publics.uid;
        this.props._dlYundata({uid: uid});
    }
    inputCase=()=>{
        RNFS.readDir(RNFS.ExternalDirectoryPath)
        .then((result) => {
            console.log('GOT RESULT', result);

            // stat the first file
            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .then((statResult) => {
            if (statResult[0].isFile()) {
              // if we have a file, read it
              return RNFS.readFile(statResult[1], 'utf8');
            }

            return 'no file';
        })
        .then((contents) => {
            // log the file contents
            console.log(contents);
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
    }
    outCase=()=>{
        /*console.log(RNFS.DocumentDirectoryPath);
        console.log(RNFS.ExternalDirectoryPath);
        console.log(RNFS.ExternalStorageDirectoryPath);*/
        //导出书架
        // 获取某个key下的所有数据(仅key-id数据)
        storage.getAllDataForKey('bookInfo').then(users => {
            console.log(users);
            let txts = JSON.stringify(users);
            //writeFile(txts)
        }).catch(err => {
            console.log(err);
        });
        /*将文本写入本地 txt*/
        function writeFile(txts) {
            // create a path you want to write to
            const path = RNFS.ExternalDirectoryPath + '/case.txt';

            // write the file
            RNFS.writeFile(path, txts, 'utf8')
                .then((success) => {
                    console.log('path', path);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }
    loginOut=()=>{
        this.props._loginOut();
        //清空cookie
        CookieManager.clearAll()
		.then((res) => {
			console.log('CookieManager.clearAll =>', res);
		});
    }
    //将要插入dom
    componentWillMount(){
        this.props._getInit();
    }
    render() {
        let txts = (<View style={styles.userLine}><Text style={styles.userText}>点击登录</Text></View>);
        if(this.props.publics.isLogin){
            txts = (
                <View style={styles.userLine}>
                    <Text style={styles.userText}>{this.props.publics.name}</Text>
                    <TouchableOpacity style={styles.loginOutBtn} onPress={()=>{this.loginOut()}}>
                    	<Text style={styles.userText}>退出</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View  style={styles.userTop}>
                    <TouchableOpacity onPress={()=>{this.doState()}}>
                        <Image 
                            source={ require('../images/user/login-photo.jpg') } 
                            style={styles.headIcon}
                        />
                        {txts}
                    </TouchableOpacity>
                </View>
                <View style={styles.funcList}>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox} onPress={()=>{this.upYundata()}}>
                            <Image 
                                source={ require('../images/icons/mf_wangpan.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>云端上传</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.prebox} onPress={()=>{this.dlYundata()}}>
                            <Image 
                                source={ require('../images/icons/mf_wangpan.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>云端下载</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox} onPress={()=>{this.inputCase()}}>
                            <Image 
                                source={ require('../images/icons/menu_icon_file_vip.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>导入图书</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox} onPress={()=>{this.outCase()}}>
                            <Image 
                                source={ require('../images/icons/menu_icon_file_vip.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>导出图书</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox}>
                            <Image 
                                source={ require('../images/icons/mf_newwork.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>用户帮助</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox}>
                            <Image 
                                source={ require('../images/icons/account_change.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>打赏作者</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ls}>
                        <TouchableOpacity style={styles.prebox}>
                            <Image 
                                source={ require('../images/icons/mf_theme.png') } 
                                style={styles.lt_icon}
                            />
                            <Text style={styles.lt_text}>联系我们</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.funcListBottom}>
                    <View style={styles.fbbox}>
                        <TouchableOpacity>
                            <View style={styles.iconbox}>
                                <Image 
                                    source={ require('../images/icons/btn_menu_options_normal.png') } 
                                    style={styles.ftb_icon}
                                />
                            </View>
                            <Text style={styles.ftb_text}>设置</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fbbox}>
                        <TouchableOpacity>
                            <View style={styles.iconbox}>
                                <Image 
                                    source={ require('../images/icons/btn_menu_about_normal.png') } 
                                    style={styles.ftb_icon}
                                />
                            </View>
                            <Text style={styles.ftb_text}>帮助中心</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fbbox}>
                        <TouchableOpacity>
                            <View style={styles.iconbox}>
                                <Image 
                                    source={ require('../images/icons/btn_menu_night_normal.png') } 
                                    style={styles.ftb_icon}
                                />
                            </View>
                            <Text style={styles.ftb_text}>夜间模式</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.fbbox}>
                        <TouchableOpacity>
                            <View style={styles.iconbox}>
                                <Image 
                                    source={ require('../images/icons/btn_menu_close_normal.png') } 
                                    style={styles.ftb_icon}
                                />
                            </View>
                            <Text style={styles.ftb_text}>退出</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );  
    } 
}  


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#eee"
    },
    userTop:{
    	width: '100%',
        height:px(Platform.OS === 'ios'?470:410),
        backgroundColor:"#ffb307",
        flexDirection:"row",
        alignItems:"center",
        justifyContent: 'center',
    },
    headIcon: {
        width: px(220),
        height: px(220),
    },
    userLine: {
    	width: '100%',
    	marginTop: px(20),
    	alignItems:"center",
    },
    userText: {
		textAlign: "center",
		lineHeight: px(60),
    },
    loginOutBtn: {
		width: px(160),
		height: px(60),
		backgroundColor: 'red'
    },
    funcList: {
        marginTop: px(20),
        paddingLeft: px(30),
        paddingRight: px(30),
    },
    ls: {
        width: '100%',
        paddingBottom: px(10),
        paddingTop: px(10),
    },
    prebox: {
        flexDirection: 'row',
        height: px(150),
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lt_icon: {
        width: px(150),
        height: px(150),
    },
    lt_text: {
        flex: 1,
        fontSize: px(50),
        paddingLeft: px(30),
    },

    funcListBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        paddingLeft: px(30),
        paddingRight: px(30),
    },
    fbbox: {
        flex: 1,
        width: '100%',
        alignItems:"center",
        paddingBottom: px(20),
    },
    iconbox:{
        flex: 1,
        alignItems:"center",
    },
    ftb_icon: {
        width: px(120),
        height: px(120),
    },
    ftb_text: {
        textAlign: 'center',
        fontSize: px(40),
        marginTop: px(10),
    },
});

function mapStateToProps(state){
    return {publics: state.publics, nav: state.nav};
}

function mapDispatchToProps(dispatch){
    return {
        _handle:(options)=>{
            dispatch(actions.handle(options))
        },
        _getInit: ()=>{
        	dispatch(actions.getInit())
        },
        _loginOut: ()=>{
        	dispatch(actions.loginOut())
        },
        _upYundata:(data, uid)=>{
            dispatch(actions.upYundata(data, uid))
        },
        _dlYundata:(data)=>{
            dispatch(actions.dlYundata(data))
        }
    }
}

const Drawer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DrawerPage);

export default Drawer;