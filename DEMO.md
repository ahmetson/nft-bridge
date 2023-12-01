
## Process of demo
Technical parameters of Bridging.
Use them in the UI.

---
### Functions used

Wrapper
bridge(nftId,chainSelector)nftOwner(nftId)
bridge(nftId,to)onlySource

Linked
bridge(nftId,chainSelector)nftOwner(nftId)
bridge(nftId,to,uri)onlySource

---Process
### Parameters

Chain amount = 3
Goal = "Bridge the element."
"Then transfer to another blockchain".
"Then unlock it".

1. wrapper.bridge(1, chain[1])
2. linked[1].bridge(1, user_0, "")
3. linked[1].bridge(1, chain[2])
4. linked[2].bridge(1, user_0, "")
5. linked[2].bridge(1, chain[0])
6. wrapper.bridge(1, user_0)