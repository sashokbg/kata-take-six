import { Given, Then, When } from '@cucumber/cucumber';
import { type GameWorld } from './support/game-world';
import { By, until, type WebDriver } from 'selenium-webdriver';
import expect from 'expect';
import { getPlayerCards, playCard, playHighestCard } from './support/helpers';

Given(/^the game has two players$/, async function (this: GameWorld) {
  const players = await this.driver.findElements(By.className('player'));
  expect(players.length).toBe(2);
});

When(/^it's the first player's turn to play$/, async function (this: GameWorld) {
  const players = await this.driver.findElements(By.className('player'));
  const className = await players[0].getAttribute('class');

  expect(className).toBe('player current');
});

Then(/^they cannot see the cards of the second player$/, async function (this: GameWorld) {
  const handElements = await this.driver.findElements(By.className('hand'));
  const allVisibleCards = await this.driver.findElements(By.css('.card.visible'));
  expect(handElements).toHaveLength(1);
  expect(allVisibleCards).toHaveLength(14);
});

When(/^it's the second player's turn to play$/, async function (this: GameWorld) {
  this.firstPlayerCards = await getPlayerCards(this.driver);

  await playHighestCard(this.driver, true);
  const players = await this.driver.findElements(By.className('player'));
  const className = await players[1].getAttribute('class');

  expect(className).toBe('player current');
});

Then(/^they cannot see the cards of the first player$/, async function (this: GameWorld) {
  const currentPlayerCards = await getPlayerCards(this.driver);

  expect(currentPlayerCards).not.toEqual(this.firstPlayerCards);
});

Given(/^it's my turn to play$/, function () {
  // NOOP
});

When(/^I (?:select|have selected) a card from my hand$/, async function (this: GameWorld) {
  const highestCard = await playHighestCard(this.driver);
  this.playedCards = [];
  this.playedCards.push(highestCard);
});

When(/^I select another card from my hand$/, async function () {
  const playedCard = await playCard(this.driver, 0);
  this.playedCards.push(playedCard);
});

Then(/^the card is played in the trick$/, async function (this: GameWorld) {
  const trickElement = await this.driver.wait(until.elementLocated(By.id('trick')));
  const card = trickElement.findElement(By.className('card'));
  const attribute = await card.getAttribute('data-number');

  expect(attribute).toEqual(this.playedCards[0].toString());
});

Then(/^the new card replaces the previous one$/, async function (this: GameWorld) {
  const trickElement = await this.driver.wait(until.elementLocated(By.id('trick')));
  const card = trickElement.findElement(By.className('card'));
  const attribute = await card.getAttribute('data-number');

  expect(this.playedCards[this.playedCards.length - 1].toString()).toEqual(attribute);
});
