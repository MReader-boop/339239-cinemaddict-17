import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createNewCommentFieldTemplate = (state) => {
  const currentComment = state.currentComment;

  return (`
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${currentComment.emoji ? `<img src="./images/emoji/${currentComment.emoji}.png" width="55" height="55" alt="emoji-${currentComment.emoji}">` : ''}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${currentComment.emoji === 'smile' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${currentComment.emoji === 'sleeping' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${currentComment.emoji === 'puke' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${currentComment.emoji === 'angry' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
  `);
};

export default class NewCommentView extends AbstractStatefulView {
  _state = null;
  #commentListComponent = null;

  constructor() {
    super();
    this._setState({
      currentComment: {
        text: '',
        emoji: ''
      }});


    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  }

  get template() {
    return createNewCommentFieldTemplate(this._state);
  }

  #emojiClickHandler = (evt) => {
    if (evt.target.classList.contains('film-details__emoji-item')) {
      const prevScrollPosition = this.element.scrollTop;

      const stateUpdate = {currentComment: {
        text: `${this._state.currentComment.text}`,
        emoji: `${evt.target.value}`
      }};

      this.updateElement(stateUpdate);
      this.element.scrollTop = prevScrollPosition;
    }
  };

  _restoreHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  };
}
