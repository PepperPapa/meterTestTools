// 直接将310工具输出的帧信息全部copy到这里，然后点击开始检查即可！
// 检查内容：
// 1.起始、结束符是否正确。
// 2.校验和是否正确。
// 3.如包含无请求数据项会列出共有多少项。

var nodata = /无请求数据/g;

function checkSum(arraydata) {
  var intdata = arraydata.map(function(i) {
    return parseInt(i, 16);
  });
  var sum = intdata.reduce(function(a, b) {
    return a + b;
  }) % 256;

  return sum;
}

function isValid(frame) {
  if (frame.length < 12) {
    return false;
  }

  if ((frame[0] !== '68') ||
      (frame[7] !== '68') ||
      (frame.slice(-1)[0] !== '16')) {
    return false;
  }

  if (checkSum(frame.slice(0, -2)) !== parseInt(frame.slice(-2, -1)[0], 16)) {
    console.log(checkSum(frame.slice(0, -2)));
    return false;
  }

  return true;
}

run.addEventListener('click', function() {
  if (test_options.value === "protocol645") {
    var data = cmdin.value.split('\n');
    var new_data = [];
    // 310抄读信息中使用的是中文"："号，也存在其他如navigator使用英文":"
    var rule = /收[：:]|发[：:]/g;
    cmdout.value = "";

    for (var i in data) {
      if ((data[i]).match(rule)) {
        new_data.push(data[i].slice(2).split(' ').filter(
          function(item) {return item;}
        ));
      }
    }

    for (var i in new_data) {
      if (isValid(new_data[i])) {
        cmdout.value += "帧格式检查合格！\n";
      } else {
        cmdout.value += "======帧格式有异常======\n";
      }
    }
    cmdout.value += ">>>共检查数据项" + (new_data.length / 2) + "项\n";
    var nodata_nums = cmdin.value.match(nodata);
    if (nodata_nums) {
      cmdout.value += ">>>无请求数据项" + nodata_nums.length + "项\n";
    }
  }
});
