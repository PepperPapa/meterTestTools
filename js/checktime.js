// 检查310抄读出的时间数据是否符合格式要求
// 主要用于需量发生时间、冻结时间等包含大量时间数据格式的检查
// 310抄读的时间数据存在两种格式：YYMMDDhhmm、YYMMDDhhmmss
// 测试方法：
// 1.使用310抄读相应的数据项，到处至excel，纵向排列
// 2.使用excel筛选出所有包含时间的数据YYMMDDhhmm
// 3.copy至检测工具的输入区域内
// 4.测试项目选择时间格式检查，点击运行

run.onclick = function() {
  if (test_options.value === "time") {
    var all_time = cmdin.value.replace(/\"/g, "");
    all_time = all_time.replace(/\s+/g, " ").split(" ");
    all_time = all_time.slice(0, -1);   // 去除最后一项空值

    var result = "";
    var error_num = 0; // 不合格项目数清零

    // 执行检查 YYMMDDhhmm、YYMMDDhhmmss
    // 1.长度为 10
    // 2.YY范围：数字即可
    // 3.MM范围：01～12
    // 4.DD范围: 01~31   未考虑闰月等情况
    // 5.hh范围: 00～23
    // 6.mm范围: 00～59
    // 7.ss范围：00～59

    for (var i in all_time) {
      var error = false;
      var YY = all_time[i].slice(0, 2);
      var MM = all_time[i].slice(2, 4);
      var DD = all_time[i].slice(4, 6);
      var hh = all_time[i].slice(6, 8);
      var mm = all_time[i].slice(8, 10);
      var ss = all_time[i].slice(10, 12);

      if (all_time[i].length !== 10 && all_time[i].length !== 12) {
        error = true;
      } else if ( !( /\d{2}/g.test(YY) ) ) {
        error = true;
      } else if (MM < 1 | MM > 12) {
        error = true;
      } else if (DD < 1 | DD > 31) {
        error = true;
      } else if (hh < 0 | hh > 23) {
        error = true;
      } else if (mm < 0 | mm > 59) {
        error = true;
      } else if (all_time[i].length === 12) {   // YYMMDDhhmmss 此格式下需检查秒
        if (ss < 0 | ss > 59) {
          error = true;
        }
      }
      // 0000000000 为合法数据，表示未发生
      if (all_time[i] === "0000000000") {
        error = false;
      }

      if (error) {
        result += all_time[i] + " --检查不合格！\n";
        error_num += 1;
      } else {
        result += all_time[i] + " --OK\n";
      }
    }
    cmdout.value = result;
    cmdout.value += "共检查数据项目数为：" + all_time.length + "\n";
    cmdout.value += "不合格项目数为：" + error_num;
  }
};
