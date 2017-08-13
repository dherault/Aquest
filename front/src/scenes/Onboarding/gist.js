import React from 'react';

class Casting {
  actors = {}

  get = actorId => this.actors[actorId]

  add = ({ id, Component, visible = false, mounted = false, topLevel = true }) => {
    // Mouhahaha
    const deadState = {
      mounted,
      props: {},
      style: {
        // opacity: visible ? 1 : 0,
      },
    };

    const Actor = p => {
      const { mounted, style, props } = deadState;

      if (!mounted) return null;

      return (
        <div style={style}>
          <Component {...p} {...props} />
        </div>
      );
    };

    return this.actors[id] = Object.assign(Actor, {
      topLevel,
      deadState,
    });
  }

}

const casting = new Casting();

const Title = () => <h1>Aquest Technologies presents</h1>;
const Button = ({ onClick }) => <button onClick={onClick}>Click me!</button>;

casting.add({
  id: 'Aquest Technologies presents',
  Component: Title,
  // mounted: false
  // visible: false,
});

casting.add({
  id: 'cool button',
  Component: Button,
  visible: true,
});

const InfoText = () => <div>Some info text</div>;

const InfoTextActor = casting.add({
  id: 'info text',
  Component: InfoText,
  // mounted: true,
  topLevel: false,
});

const Info = () => (
  <div>
    Here is some info:
    <InfoTextActor />
  </div>
);

casting.add({
  id: 'info',
  Component: Info,
  visible: true,
});

// NOTE: replace update with hold (do not update yet)
// merge wait run and hold
const scenario = {
  'first scene': _ => {
    _.mount('Aquest Technologies presents');
    _.wait(3000);
    _.unmount('Aquest Technologies presents');
    _.wait(1000);
    _.runScene('second scene');
  },
  'second scene': _ => {
    _.mount('cool button', {
      onClick: () => _.run(_ => {
        _.unmount('cool button');
        _.runScene('third scene');
      }),
    });
  },
  // With deep children
  'third scene': _ => {
    _.mount('info');
    _.wait(2000);
    _.mount('info text');
    _.wait(2000);
    _.unmount('info');
  },
};

class Shooting extends React.Component {

  queue = []
  onHold = false

  hold = () => this.queue.push({ type: 'HOLD' })

  resume = () => this.queue.push({ type: 'RESUME' })

  wait = duration => this.queue.push({
    type: 'WAIT',
    duration,
  })

  mount = (actorId, props) => this.queue.push({
    type: 'MOUNT',
    actorId,
    props,
  })

  unmount = (actorId) => this.queue.push({
    type: 'UNMOUNT',
    actorId,
  })

  update = () => {
    if (!this.onHold) this.forceUpdate();
  }

  runScene = (sceneId, dequeue = false) => {
    console.log('runScene:', sceneId);
    const sceneFn = this.props.scenario[sceneId];

    if (typeof sceneFn !== 'function') throw new Error(`scene "${sceneId}" not found in scenario`);

    sceneFn(this._);

    console.log('end runScene:', sceneId, 'queue:', this.queue);

    if (dequeue) this.dequeue();
  }

  run = fn => {
    fn(this._);
    this.dequeue();
  }

  _ = {
    hold: this.hold,
    resume: this.resume,
    wait: this.wait,
    mount: this.mount,
    unmount: this.unmount,
    run: this.run,
    runScene: this.runScene,
    update: this.update,
    forceUpdate: this.forceUpdate.bind(this),
  }

  dequeue = () => {
    const { casting } = this.props;
    const action = this.queue.shift();

    console.log('dequeue:', action);

    if (!action) return;

    let promise;

    switch (action.type) {
      case 'HOLD':
        this.onHold = true;
        promise = Promise.resolve();
        break;

      case 'RESUME':
        this.onHold = false;
        this.update();
        promise = Promise.resolve();
        break;

      case 'WAIT':
        promise = new Promise(resolve => setTimeout(resolve, action.duration));
        break;

      case 'MOUNT':
        promise = new Promise(resolve => {
          const { deadState } = casting.get(action.actorId);

          deadState.mounted = true;
          Object.assign(deadState.props, action.props);

          console.log('deadState.props:', deadState.props);
          this.update();
          resolve();
        });
        break;

      case 'UNMOUNT':
        promise = new Promise(resolve => {
          casting.get(action.actorId).deadState.mounted = false;
          this.update();
          resolve();
        });
        break;

      default:
        promise = Promise.resolve();
    }

    return promise.then(this.dequeue);
  }

  componentDidMount() {
    const { firstScene, scenario } = this.props;

    console.log('Mounted Shooting. Running first scene');

    this.runScene(firstScene || Object.keys(scenario)[0], true);
  }

  render() {
    const { casting } = this.props;
    const children = [];

    Object.keys(casting.actors).forEach(actorId => {
      const Actor = casting.actors[actorId];

      if (Actor.topLevel) children.push(<Actor key={actorId} />);
    });

    return (
      <div>
        {children}
      </div>
    );
  }
}
