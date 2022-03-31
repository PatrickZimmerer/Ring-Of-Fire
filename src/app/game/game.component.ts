import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  dialogRef;
  gameOver = false;
  game!: Game;
  gameId: string;
  constructor(
    private router: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.router.params.subscribe((params) => {
      this.gameId = params['id'];
      this.firestore
        .collection('games')
        .doc(params['id'])
        .valueChanges()
        .subscribe((game: any) => {
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.playerImages = game.playerImages;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        });
    });
  }
  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogAddPlayerComponent);

    this.dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0 && name.length < 16) {
        this.game.players.push(name);
        this.game.playerImages.push('player.png');
        this.saveGame();
      } else if (name && name.length <= 0 && name.length > 16) {
        alert('Player name must be between 1 and 16 characters');
      } else {
        return;
      }
    });
  }

  saveGame() {
    this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson());
  }

  editPlayer(playerNumber: number) {
    this.dialogRef = this.dialog.open(EditPlayerComponent);
    this.dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerNumber, 1);
          this.game.playerImages.splice(playerNumber, 1);
          return;
        }
        this.game.playerImages[playerNumber] = change;
        this.saveGame();
      }
    });
  }
  newGame() {
    this.game = new Game();
  }

  drawCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (this.game.players.length > 1) {
      if (!this.game.pickCardAnimation) {
        this.pickCardAction();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000);
      }
    } else {
      alert('Add at least 2 Players drinking alone is not fun!');
    }
  }

  pickCardAction() {
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;

    this.saveGame();
  }
}
