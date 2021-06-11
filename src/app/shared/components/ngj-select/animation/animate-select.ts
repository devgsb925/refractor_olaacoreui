import { trigger, animate, transition, style } from '@angular/animations';

export const fadeInAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger(
        'fadeInAnimation', 
        [
          transition(
            ':enter', 
            [
              style({ height: 0, opacity: 0 }),
              animate('1s ease-out', 
                      style({ height: 300, opacity: 1 }))
            ]
          ),
          transition(
            ':leave', 
            [
              style({ height: 300, opacity: 1 }),
              animate('1s ease-in', 
                      style({ height: 0, opacity: 0 }))
            ]
          )
        ]
      );
