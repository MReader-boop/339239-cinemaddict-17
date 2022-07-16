import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createNewCommentFieldTemplate = (state) => {
  const currentComment = state;

  return (`
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${currentComment.emotion ? `<img src="./images/emoji/${currentComment.emotion}.png" width="55" height="55" alt="emoji-${currentComment.emotion}">` : ''}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${currentComment.comment}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${currentComment.emotion === 'smile' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${currentComment.emotion === 'sleeping' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${currentComment.emotion === 'puke' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${currentComment.emotion === 'angry' ? 'checked' : ''}>
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
      comment: '',
      emotion: ''
    });


    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  }

  get template() {
    return createNewCommentFieldTemplate(this._state);
  }

  #emojiClickHandler = (evt) => {
    if (evt.target.classList.contains('film-details__emoji-item')) {
      const currentCommentText = this.element.querySelector('.film-details__comment-input').value;
      const prevScrollPosition = this.element.scrollTop;

      const stateUpdate = {
        comment: `${currentCommentText}`,
        emotion: `${evt.target.value}`
      };

      this.updateElement(stateUpdate);
      this.element.scrollTop = prevScrollPosition;
    }
  };

  setEnterKeydownHandler = (callback) => {
    this._callback = callback;

    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#enterKeydownHandler);
  };

  #enterKeydownHandler = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      if (this._state.emotion && this._state.comment){
        this._callback(this._state);
      }
    }
  };

  _restoreHandlers = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#enterKeydownHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emojiClickHandler);
  };
}
