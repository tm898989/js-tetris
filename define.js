// グローバル変数初期化
var FPS = 30;                       // フレームレート
var MAX_ROW = 10+2;                 // 横のマス数
var MAX_COL = 20+3;                 // 縦のマス数
var CELL_SIZE = 16;                 // マスのサイズ(ブロック一つあたりのサイズ)
var WAIT = 4;                       // キー入力の待ち時間
var TETRIS_IMG = "tetris.png";      // 壁とテトリミノブロックの画像
var SCORE_BOARD = "score.png";      // スコアボードのイメージ

// 得点のデータ
var DATA = [];
    DATA[0] = {"point":0, "mess":"´･ω･`"};
    DATA[1] = {"point":200, "mess":"GREAT!"};
    DATA[2] = {"point":800, "mess":"DOUBLE!"};
    DATA[3] = {"point":2400, "mess":"TRIPLE!"};
    DATA[4] = {"point":5000, "mess":"TETRIS!"};

// テトリミノの定義
var TYPE_I = [
    [[0, 0], [-1, 0], [1, 0], [2, 0]],
    [[0, 0], [0, -1], [0, 1], [0, 2]],
    [[0, 0], [-1, 0], [1, 0], [2, 0]],
    [[0, 0], [0, -1], [0, 1], [0, 2]],
];
var TYPE_O = [
    [[0, 0], [1, 0], [0, -1], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [1, -1]],
];
var TYPE_S = [
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]],
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, -1], [1, 0], [1, 1]],
];
var TYPE_Z = [
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [0, 1], [1, 0], [1, -1]],
    [[0, 0], [1, 0], [0, -1], [-1, -1]],
    [[0, 0], [0, 1], [1, 0], [1, -1]],
];
var TYPE_J = [
    [[0, 0], [-1, 0], [-1, -1], [1, 0]],
    [[0, 0], [0, -1], [1, -1], [0, 1]],
    [[0, 0], [1, 0], [1, 1], [-1, 0]],
    [[0, 0], [0, 1], [-1, 1], [0, -1]],
];
var TYPE_L = [
    [[0, 0], [1, 0], [1, -1], [-1, 0]],
    [[0, 0], [0, 1], [1,  1], [0, -1]],
    [[0, 0], [-1, 0], [-1, 1], [1, 0]],
    [[0, 0], [0, -1], [-1, -1], [0, 1]],
];
var TYPE_T = [
    [[0, 0], [0, -1], [-1, 0], [1, 0]],
    [[0, 0], [0, -1], [0, 1], [1, 0]],
    [[0, 0], [0, 1], [-1, 0], [1, 0]],
    [[0, 0], [0, -1], [-1, 0], [0, 1]],
];
var GAMEOVER = [];
    GAMEOVER[0 ] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[1 ] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[2 ] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[3 ] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[4 ] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[5 ] = [5,5,5,1,6,1,2,1,2,7,7,7];
    GAMEOVER[6 ] = [5,1,1,6,1,6,2,2,2,7,1,1];
    GAMEOVER[7 ] = [5,1,5,6,6,6,2,1,2,7,7,1];
    GAMEOVER[8 ] = [5,1,5,6,1,6,2,1,2,7,1,1];
    GAMEOVER[9 ] = [5,5,5,6,1,6,2,1,2,7,7,7];
    GAMEOVER[10] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[11] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[12] = [3,3,3,8,1,8,7,7,7,4,4,4];
    GAMEOVER[13] = [3,1,3,8,1,8,7,1,1,4,1,4];
    GAMEOVER[14] = [3,1,3,8,1,8,7,7,1,4,4,1];
    GAMEOVER[15] = [3,1,3,8,1,8,7,1,1,4,1,4];
    GAMEOVER[16] = [3,3,3,1,8,1,7,7,7,4,1,4];
    GAMEOVER[17] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[18] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[19] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[20] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[21] = [1,1,1,1,1,1,1,1,1,1,1,1];
    GAMEOVER[22] = [1,1,1,1,1,1,1,1,1,1,1,1];
//***********************************
//          ゲーム内関数
//***********************************
function createField(){
    var field = [];
    for (var i=0; i<MAX_COL; i++) {
        var temp_array = [];
        for (var j=0; j<MAX_ROW; j++) {
            if (j == 0　|| i==MAX_COL-1 || j==MAX_ROW-1)temp_array[j] = 1; // ブロック(壁)を配置
            else temp_array[j] = 0; // 空
        }
        field[i] = temp_array;
    }
    
    return field;
}
function deleteLine(field){
        
    var checker = true;
    var line = 0;
    for (var i = MAX_COL - 2; i > 1; i--) {
        //　下から順番にチェック
        checker = true;
        for (var j=1; j < MAX_ROW - 1; j++) {
            // ラインをチェック
            if (field[i][j] == 0){
                //　ラインがそろってい無ければfalse
                checker = false;
            }
        }
        // 揃ったブロックを消去
        if (checker){
            // 上の段をつめる
            for (var l = i; l > 1; l--){
                for (var j = 1; j < MAX_ROW - 1; j++){
                    //
                    field[l][j] = field[l - 1][j];
                }
            }
            line++;
            i++;
        }
    }
    
    return {"field": field, "point":DATA[line].point, "mess":DATA[line].mess};
}
function gameStart(game){
    var start = new Scene();
        start.backgroundColor = "#000000";
    var title = new Label("TETRIS");
        title.x = 0;
        title.y = 8 * CELL_SIZE;
        title.color = 'rgba(0, 255, 0, 1)';
        title.font = "32px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
        start.addChild(title);
    var start_message = new Label("Touch Start");
        start_message.x = 0;
        start_message.y = 10 * CELL_SIZE;
        start_message.color = 'rgba(0, 255, 0, 1)';
        start_message.font = "16px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
        start.addChild(start_message);
    game.pushScene(start);
    start.addEventListener('touchstart', function() {
        game.pushScene(game.rootScene);
    });
}
function speedUp(point){
    var speed = FPS;
    if(point > 10000)speed = 26;
    if(point > 30000)speed = 22;
    if(point > 50000)speed = 18;
    if(point > 75000)speed = 14;
    if(point >100000)speed = 10;

    return speed;
}