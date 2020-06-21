remember to use CommonJS syntax when defining sharable components (used by both React and Node) here...

eg;
```
const BookRequestStatus = {
    requested: 'requested',
    ordered: 'ordered',
    available: 'available',
    declined: 'declined'
}
module.exports = BookRequestStatus;
```

to call it;
- in Node use the require syntax (`const BookStatus = require('../enums/BookRequestStatus');`)
- in React use import syntax (`import BookStatus from '../../../enums/BookRequestStatus';`)
