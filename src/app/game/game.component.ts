import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string;
  dialogRef;
  game!: Game;
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }
  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogAddPlayerComponent);

    this.dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0 && name.length < 16) {
        this.game.players.push(name);
      } else {
        alert('Player name must be between 1 and 16 characters');
      }
    });
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  drawCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }
}
