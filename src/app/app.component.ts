import {Component, AfterViewInit} from '@angular/core';
import * as Muuri from 'muuri';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  data: any;

  constructor() {
  }

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', function () {
      let docElem = document.documentElement;
      let kanban = document.querySelector('.kanban-demo');
      let board = kanban.querySelector('.board');
      let itemContainers = Array.prototype.slice.call(kanban.querySelectorAll('.board-column-content'));
      let columnGrids = [];
      let dragCounter = 0;
      let boardGrid;

      itemContainers.forEach(function (container) {
        let muuri = new Muuri(container, {
          items: '.board-item',
          layoutDuration: 400,
          layoutEasing: 'ease',
          dragEnabled: true,
          dragSort: function () {
            return columnGrids;
          },
          dragSortInterval: 0,
          dragContainer: document.body,
          dragReleaseDuration: 400,
          dragReleaseEasing: 'ease'
        })
          .on('dragStart', function (item) {
            ++dragCounter;
            docElem.classList.add('dragging');
            item.getElement().style.width = item.getWidth() + 'px';
            item.getElement().style.height = item.getHeight() + 'px';
          })
          .on('dragEnd', function (item) {
            if (--dragCounter < 1) {
              docElem.classList.remove('dragging');
            }
          })
          .on('dragReleaseEnd', function (item) {
            item.getElement().style.width = '';
            item.getElement().style.height = '';
            columnGrids.forEach(function (muuri) {
              muuri.refreshItems();
            });
          })
          .on('layoutStart', function () {
            boardGrid.refreshItems().layout();
          });

        columnGrids.push(muuri);
      });

      boardGrid = new Muuri(board, {
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragEnabled: true,
        dragSortInterval: 0,
        dragStartPredicate: {
          handle: '.board-column-header'
        },
        dragReleaseDuration: 400,
        dragReleaseEasing: 'ease'
      });
    });
  }
}
