const foo = 'bar';

function isManualRun() {
  return typeof $request === 'undefined' || ($request.body && JSON.parse($request.body).foo === 'bar');
}

if (isManualRun()) {
  console.log('❌ 請勿手動執行此腳本');
  $done(typeof $request === 'undefined' ? {} : $request);
} else {
  try {
    const body = JSON.parse($request.body);
    if (
      body.campaignCode === 'BIGGERFREEKICK26' &&
      body.taskCode === 'GAME' &&
      typeof body.gameResult !== 'undefined'
    ) {
      body.gameResult = 'PERFECT';
      $request.body = JSON.stringify(body);
    }
  } catch (error) {
    console.log(`❌ ${error}`);
  }
  $done($request);
}
