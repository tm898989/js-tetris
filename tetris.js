enchant();
window.onload = function(){
    var game = new Core(MAX_ROW * CELL_SIZE, MAX_COL * CELL_SIZE);
    game.fps = FPS;
    game.preload(TETRIS_IMG, SCORE_BOARD);
    game.onload = function(){
        // start_scene
        gameStart(game);

        // ゲーム初期化
        var count = 0;
        var point = 0;
        var speed = FPS;
        var key_wait = WAIT;
        var map = new Map(CELL_SIZE, CELL_SIZE);      // フィールド描画用&当たり判定用マップ
        var field = createField();                    // フィールドのデータ

        // ステージ作成
        map.image = game.assets[TETRIS_IMG];    // mapにブロック画像を読みこませる
        map.loadData(field);                    // mapにフィールドを読みこませる
        game.rootScene.addChild(map);           // マップをシーンに追加

        // スコアボードのイメージ
        var score_img = new Sprite(CELL_SIZE * MAX_ROW, CELL_SIZE * 2);
        score_img.image = game.assets[SCORE_BOARD];
        game.rootScene.addChild(score_img);

        // メッセージラベル
        var message = new Label("Start!!");
            message.moveTo(5, 10);
            message.font = "14px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            message.color = 'rgba(0, 255, 0, 1)';
        game.rootScene.addChild(message);

        // スコアラベル
        var score = new Label("0");
            score.moveTo(135, 10);
            score.font = "14px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            score.color = 'rgba(0, 255, 0, 1)';
        game.rootScene.addChild(score);

        // テトリスオブジェクト
        var tetris = new Tetris();

        // ゲームパッド
        var pad = new Pad();
        pad.moveTo(CELL_SIZE * 3,CELL_SIZE * 3);
        game.rootScene.addChild(pad);
        
        game.rootScene.on("enterframe", function() {
            //メインループ
            count++;
            key_wait--;

            // ゲームスピード
            if(count % speed === 0 && tetris.fall){
                
                if(tetris.isMove(0, 1, 0, field)){
                    tetris.status.posY++;
                    point++;
                }
                else {
                    // 処理が終わるまでテトリスブロックの動きを止めるThe World
                    tetris.fall = false; 
                    // fieldに記録する処理 
                    field = tetris.updateField(field);

                    // lineエフェクト
                    var effect = tetris.effectLine(field);
                    game.rootScene.addChild(effect);

                    // ゲームを一時的に止めて処理を実行する
                    game.rootScene.tl.delay(speed / 3).then(function(){
                        // 1/3秒後に処理を再開
                        game.rootScene.removeChild(effect);
                        // Lineチェックとスコア計算
                        var data = deleteLine(field);
                        field  = data.field;
                        point += data.point;
                        message.text = data.mess; 
                        map.loadData(field);
                        // 新しいブロックを作成
                        tetris.delete();
                        tetris = new Tetris(tetris.next.color);

                        // ゲームパッドを前面に
                        game.rootScene.removeChild(pad);
                        game.rootScene.addChild(pad);
                        
                        if(!tetris.isMove(0, 0, 0, field)){
                            // ゲームオーバーの処理
                            game.rootScene.removeChild(pad);
                            tetris.delete();
                            map.loadData(GAMEOVER);
                            message.text = " x_x";
                            game.stop();
                        }
                    });
                }
            }
            //////////////////////
            // キー操作
            //////////////////////
            if (game.input.up && key_wait <= 0) {
                
                if(tetris.isMove(0, 0, 1, field)){
                    
                    tetris.status.rota++;
                }
                key_wait = WAIT;
            }
            if (game.input.left && key_wait <= 0) {
                
                if(tetris.isMove(-1, 0, 0, field)){
                    
                    tetris.status.posX--;
                    point++;
                }
                key_wait = WAIT;
            }
            if (game.input.right && key_wait <= 0) {
                
                if(tetris.isMove(1, 0, 0, field)){
                    
                    tetris.status.posX++;
                    point++;
                }
                key_wait = WAIT;
            }
            if (game.input.down) {
                
                if(tetris.isMove(0, 1, 0, field)){
                    
                    tetris.status.posY++;
                    point++;
                }
            }
            if (tetris.fall){

                // ポイント更新
                score.text = ("00000"+point).slice(-6);
                // ブロック更新
                tetris.updateBlock(); 
            }

            speed = speedUp(point);
        });   
    };
    game.start();

    /////////////////////
    // TETRISクラス
    /////////////////////
    var Tetris = Class.create({
        initialize:function(c){
            if (!c)c = this.randomType();
            this.fall = true;      // テトリスがコントロール可能か否か
            this.status = {color:c, posX:5, posY:3, rota:0};
            this.type   = this.getType(this.status.color);
            this.block = this.drowBlock(this.status, this.type);
            // ネクストブロック
            this.next  = {color:this.randomType(), posX:5, posY:1, rota:0};
            this.nextType = this.getType(this.next.color);
            this.nextBlock = this.drowBlock(this.next, this.nextType);
            // 位置調節
            this.nextBlock.scaleX = 0.5;
            this.nextBlock.scaleY = 0.5;
            this.nextBlock.moveTo(47, 10);
            // シーンに追加
            game.rootScene.addChild(this.block);
            game.rootScene.addChild(this.nextBlock);;
        },
        delete:function(){
            // シーンから削除
            game.rootScene.removeChild(this.block);
            game.rootScene.removeChild(this.nextBlock);
        },
        drowBlock:function(status, type){
            // ブロックの描画
            var block = new Group();       
            // ブロックグループにスプライトを追加
            for (var i　=　0; i　<　type[status.rota].length; i++) {
                var x = ( status.posX + type[status.rota][i][0] ) * CELL_SIZE;
                var y = ( status.posY + type[status.rota][i][1] ) * CELL_SIZE;
                var sprite = new Sprite(CELL_SIZE, CELL_SIZE);
                sprite.image = game.assets[TETRIS_IMG];
                sprite.moveTo(x, y);
                sprite.frame = status.color;
                block.addChild(sprite);
            }
            return block;
        },
        updateBlock:function(){
            // ブロックの形を書き換え（ブロックの回転や移動）
            if(this.status.rota >= this.type.length){
                this.status.rota = 0;
            }
            for (var i　=　0; i　<　this.type[this.status.rota].length; i++) {     
                var x = ( this.status.posX + this.type[this.status.rota][i][0] ) * CELL_SIZE;
                var y = ( this.status.posY + this.type[this.status.rota][i][1] ) * CELL_SIZE;
                // ブロックの座標を変更する
                this.block.childNodes[i].moveTo(x, y);    
            }
        },
        updateField:function(field){
            //　落ちたブロックをフィールドに記録
            for (var i = 0; i < this.type[this.status.rota].length; i++){
                var x = this.status.posX + this.type[this.status.rota][i][0];
                var y = this.status.posY + this.type[this.status.rota][i][1];
                // フィールドを更新する
                field[y][x] = this.status.color;
            }
            return field;
        },
        isMove:function(x, y, r, f){
            // ブロックのあたり判定を行うメソッド
            var vx =  this.status.posX + x;
            var vy =  this.status.posY + y;
            var vr =  this.status.rota + r;
            if(vr >= this.type.length){
                vr = 0;
            }
            for (var i　=　0; i　<　this.type[vr].length; i++){
                var tx = vx + this.type[vr][i][0];
                var ty = vy + this.type[vr][i][1];
                if (f[ty][tx] != 0) return false;
            }
            return true;
        },
        effectLine:function(f){
            // テトリスの消えるエフェクト
            var effect = new Group();
            var checker = true;
            for (var i = MAX_COL - 2; i > 1; i--) {
                //　下から順番にチェック
                checker = true;
                for (var j=1; j < MAX_ROW - 1; j++) {
                    // ラインをチェック
                    if (f[i][j] == 0){
                        //　ラインがそろってい無ければfalse
                        checker = false;
                    }
                }
                if(checker){
                    for (var l=1; l < MAX_ROW - 1; l++) {
                        // ブロックが消える時の画像を追加
                        var sprite = new Sprite(CELL_SIZE, CELL_SIZE);
                        sprite.image = game.assets[TETRIS_IMG];
                        sprite.moveTo(l * CELL_SIZE, i * CELL_SIZE);
                        sprite.frame = 9;
                        effect.addChild(sprite);
                    }
                }
            }
            return effect;
        },
        //////////////////////
        // private
        //////////////////////
        randomType:function(){
            // 2 ~ 8のタイプをランダムで返す
            var min = 2;
            var max = 8;
            return Math.floor( Math.random() * ( max + 1 - min ) ) + min;
        },
        getType:function(color){
            // テトリスのブロック定義を取得
            var type = [];
            switch(color){
                case 2:
                    type = TYPE_I;
                    if (this.status.color == 2)  this.status.posY = 2;
                    break;
                case 3:
                    type = TYPE_O;
                    break;
                case 4:
                    type = TYPE_S;
                    break;
                case 5:
                    type = TYPE_Z;
                    break;
                case 6:
                    type = TYPE_J;
                    break;
                case 7:
                    type = TYPE_L;
                    break;
                case 8:
                    type = TYPE_T;
                    break;
                default:
                    type = TYPE_T;
                    console.log("BLOCK TYPE ERROR!!");
                    break;
            }
            return type;
        },
    });
};