/**
 * Created by Aaronzm on 2018/7/12.
 */
const QQMapWX = require('./qqmap-wx-jssdk.min'),
    amapFile = require('./amap-wx');
const Qmap = new QQMapWX({key: 'LU7BZ-FUDLD-5GR4I-HMU3F-X3NL7-ZIBYI'}),
    Amap = new amapFile.AMapWX({key: 'c6fee698be9bdfa07b51099985d3d945'});
module.exports = {
    Qmap,
    Amap
};