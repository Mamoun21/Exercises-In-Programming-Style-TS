Constraints:

     1-Larger problem is decomposed into entities using some form of abstraction (objects, modules or similar).
     2-The entities are never called on directly for actions.
     3-The entities provide interfaces for other entities to be able to register callbacks.
     4-At certain points of the computation, the entities call on the other entities that have registered for callbacks.

Possible names:

     Hollywood agent: "don't call us, we'll call you"
     Inversion of control
     Callback heaven/hell