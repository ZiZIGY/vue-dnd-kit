import { expect, test, type Page } from '@playwright/test';
import { trackErrors, trackVueWarnings } from './helpers';
import { at, byId, drag, hold, press, settled, watchAfterCommit } from './app-helpers';

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const fen = (page: Page) => page.getByTestId('chess-fen');
const square = (page: Page, name: string) => page.locator(`[data-square="${name}"]`);
const legalSquares = (page: Page) =>
  page.locator('[data-legal]').evaluateAll((squares) => squares.map((element) => element.getAttribute('data-square')).sort());

/** Drags the piece on `from` to `to`, releasing inside the square but off its center. */
const play = async (page: Page, from: string, to: string) => {
  await drag(page, square(page, from), await at(square(page, to), 0.4, 0.6), 12);
  await settled(page);
};

test.describe('app: chess', () => {
  let errors: string[];
  let warnings: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    warnings = trackVueWarnings(page);
    await page.goto('/#app-chess');
    await expect(fen(page)).toHaveText(`${START} w`);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('legal squares light up from the drag state, and a legal move is played', async ({ page }) => {
    await hold(page, square(page, 'e2'), await at(square(page, 'e4'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual(['e3', 'e4']);
    await expect(square(page, 'e2')).toHaveAttribute('data-source');
    await page.mouse.up();
    await settled(page);
    await expect(fen(page)).toHaveText('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b');
    await expect(page.locator('[data-legal]')).toHaveCount(0);
    await expect(page.getByTestId('chess-status')).toHaveText('Black to move');
    await expect(page.getByTestId('chess-moves')).toHaveText('e2-e4');
  });

  test('while the piece lands, the board shows no moves from its new square', async ({ page }) => {
    await hold(page, square(page, 'e2'), await at(square(page, 'e4'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual(['e3', 'e4']);
    const afterCommit = await watchAfterCommit(page, '[data-testid="chess-fen"]', '[data-legal], .refused');
    await page.mouse.up();
    const { frames, seen } = await afterCommit();
    // The pawn is on e4 now: legal squares from there (e5) or a "refused" e4 would be the next move.
    expect(frames).toBeGreaterThan(0);
    expect(seen).toEqual([]);
    await settled(page);
    await expect(fen(page)).toHaveText('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b');
  });

  test('an illegal move flies back, and the side not to move cannot drag', async ({ page }) => {
    await hold(page, square(page, 'b1'), await at(square(page, 'b3'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual(['a3', 'c3']);
    await expect(square(page, 'b3')).toHaveClass(/refused/);
    await page.mouse.up();
    await settled(page);
    await expect(fen(page)).toHaveText(`${START} w`);
    await expect(byId(page, 'wN-b')).toBeVisible();

    // Black's turn hasn't come: its pieces don't move at all.
    await hold(page, square(page, 'e7'), await at(square(page, 'e5'), 0.4, 0.6));
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up();
    await expect(fen(page)).toHaveText(`${START} w`);
  });

  test('sliding pieces are blocked, and captures take pieces off the board', async ({ page }) => {
    // The bishop has nowhere to go at the start.
    await hold(page, square(page, 'f1'), await at(square(page, 'f3'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual([]);
    await page.mouse.up();
    await settled(page);

    await play(page, 'e2', 'e4');
    await play(page, 'd7', 'd5');
    await hold(page, square(page, 'e4'), await at(square(page, 'd5'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual(['d5', 'e5']);
    await expect(square(page, 'd5')).toHaveClass(/capture/);
    await page.mouse.up();
    await settled(page);
    await expect(fen(page)).toHaveText('rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b');
    await expect(page.getByTestId('taken-w')).toContainText('♟');

    // Now the bishop's diagonal is open up to the pawn it may take back... and beyond.
    await play(page, 'd8', 'd5');
    await hold(page, square(page, 'f1'), await at(square(page, 'c4'), 0.4, 0.6));
    expect(await legalSquares(page)).toEqual(['a6', 'b5', 'c4', 'd3', 'e2']);
    await page.mouse.up();
    await settled(page);
    await expect(page.getByTestId('chess-moves').locator('li')).toHaveText(['e2-e4 d7-d5', 'e4xd5 d8xd5', 'f1-c4']);
  });

  test('keyboard: arrows jump between legal squares only', async ({ page }) => {
    await byId(page, 'wN-g').focus();
    await press(page, 'Space', 'ArrowLeft');
    await expect(square(page, 'f3')).toHaveClass(/over/);
    await press(page, 'Space');
    await settled(page);
    await expect(fen(page)).toHaveText('rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b');

    await byId(page, 'bN-b').focus();
    await press(page, 'Space', 'ArrowRight');
    await expect(square(page, 'c6')).toHaveClass(/over/);
    await press(page, 'Space');
    await settled(page);
    await expect(fen(page)).toHaveText('r1bqkbnr/pppppppp/2n5/8/8/5N2/PPPPPPPP/RNBQKB1R w');

    await page.getByTestId('new-game').click();
    await expect(fen(page)).toHaveText(`${START} w`);
    await expect(page.getByTestId('chess-moves').locator('li')).toHaveCount(0);
  });
});
