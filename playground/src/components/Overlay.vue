<script setup lang="ts">
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities, state, overlay } = useDnDProvider();
</script>

<template>
  <div
    v-if="state === 'dragging'"
    class="dnd-kit-default-overlay"
    :style="{
      '--position-x': overlay.position.value.x + 'px',
      '--position-y': overlay.position.value.y + 'px',
    }"
  >
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae ducimus
    consequatur nihil quisquam? Quibusdam, eius laborum, labore vel id earum
    sint illum rem voluptate nemo aspernatur fugiat ratione quidem, iusto cum
    architecto? Itaque aperiam necessitatibus adipisci saepe repellendus est
    soluta fuga, libero cupiditate dolor sunt ad excepturi tempora id quis dicta
    doloribus ipsa deserunt rerum quae. Quisquam adipisci vero debitis sint, ex
    cum dignissimos? Optio porro accusamus eaque incidunt, consequatur,
    consectetur minus repudiandae beatae neque quae dolor nihil veniam vel
    nesciunt molestias excepturi fugit? Quos eligendi mollitia repudiandae ipsa
    quis consectetur esse eius unde provident, quam porro rem odio dolores ea
    voluptatum nihil voluptatem explicabo accusamus, corporis consequuntur
    asperiores, suscipit ad! Illo distinctio doloremque quis expedita, eos
    necessitatibus aliquid voluptates accusantium! Omnis corrupti id sint
    dignissimos adipisci, voluptatibus deleniti nostrum cupiditate non laborum
    dolore quod maxime tempora molestiae odit iure voluptatum sapiente
    perspiciatis laboriosam! Cupiditate illo totam, dolorum repellat minus nihil
    iusto perferendis reprehenderit saepe quos adipisci fugit, earum tenetur
    quam impedit officia nostrum! Unde voluptatem laudantium quaerat dolores
    omnis iure repudiandae perspiciatis dolore, numquam accusamus laborum
    praesentium eveniet nulla vero, iste optio quis rem ab dignissimos impedit.
    Eius nemo temporibus dicta iste odit officiis cum illum? Voluptate ipsum
    necessitatibus minima ratione! Eligendi voluptatum rerum in architecto
    distinctio! Distinctio, incidunt! Nobis ab, pariatur consectetur unde animi
    deleniti accusantium facere, dolorum omnis error esse dolore? Nisi adipisci
    a at tempore tenetur illum culpa, eaque earum vitae quae, quas quisquam hic
    beatae! Nihil perferendis dolorem ipsam maxime voluptate quos exercitationem
    cupiditate debitis sunt nostrum rem dolores sint eligendi incidunt harum ab
    animi, alias doloremque laborum deleniti ea ipsa aliquam. Odit molestiae vel
    non consectetur magni incidunt suscipit dolor praesentium est pariatur
    temporibus quae laboriosam et minima veritatis, ea delectus assumenda
    officiis, perspiciatis ipsam culpa illum eligendi. Itaque temporibus
    recusandae fuga odit, quidem ad atque veritatis minus maxime! Fugiat harum,
    incidunt distinctio magnam numquam exercitationem vitae est laboriosam
    veritatis enim, error reiciendis tempora cum facere accusamus. Dolor rerum
    quod mollitia nostrum aliquid perspiciatis, voluptatibus omnis, voluptatem
    porro architecto fuga atque nesciunt non a ea necessitatibus veritatis modi
    quam possimus dolorem magnam blanditiis eos repellat. Doloremque qui sint
    culpa animi impedit, sequi eligendi corporis quos. Voluptas excepturi nihil
    ratione facere, voluptatem pariatur necessitatibus officiis harum dolorem
    aspernatur et accusamus commodi. Facere nesciunt cumque eaque beatae,
    facilis nobis a ipsa rem exercitationem earum. Libero quo sint, illum totam
    modi repudiandae commodi quaerat similique, blanditiis natus iste amet
    voluptatem dolores. Ut cum esse quibusdam ipsum, quia porro voluptas
    veritatis. Ipsam, laborum iusto sequi recusandae facere maiores illo magni
    quas adipisci, iste consequuntur harum? Id adipisci, quam omnis ex facilis
    eius iusto vitae in natus? Perferendis facere vero eum ipsam explicabo
    veritatis, fuga totam reprehenderit repellat animi facilis sapiente quisquam
    omnis nobis debitis ipsa ea corporis provident iure eveniet placeat esse
    non! Saepe delectus porro, similique laborum sint ab dignissimos illum
    tempora quas aliquam fuga expedita quidem a ullam hic cupiditate
    perspiciatis fugit quae odio quisquam esse eveniet nostrum? Alias numquam
    fuga optio perferendis corporis, asperiores nemo illo quis esse dolor
    repellat architecto, soluta officia facere. Error aspernatur id nihil, ex
    officia nisi ipsa odit praesentium quo vitae voluptate ullam, sequi eaque
    reiciendis? Obcaecati nostrum earum consectetur sequi aliquid eligendi
    libero quidem velit ex dolore expedita animi vero incidunt soluta, officiis
    dolorem veniam placeat, natus, ab aperiam? Tempore provident culpa ex fuga
    quia suscipit ut! Voluptatem veritatis est consectetur unde harum quam
    corrupti dolore, corporis consequatur ut maxime animi, accusamus beatae
    architecto sequi laborum. Tempora quia vero excepturi nulla doloribus? Quae
    modi error beatae nam vitae magnam assumenda aliquam voluptatem pariatur est
    ex eos sapiente quisquam voluptates fugit natus, doloremque eligendi cumque
    quis adipisci corporis iste illum non id. Non cumque sed vel exercitationem
    deserunt nisi, culpa suscipit doloremque officiis consequatur, dolorem
    aliquid quas voluptatem laborum, facilis commodi molestias eius? Suscipit
    aut impedit facilis in corporis incidunt laborum, consequuntur laboriosam
    sequi! Accusamus reiciendis rem illum, ut voluptas odit quis. Optio dolores
    sint modi placeat sapiente voluptatum officiis numquam facilis fuga nobis,
    maiores sed libero excepturi quibusdam illum. Autem amet labore ipsum vel
    dolorum, doloremque debitis, odit maxime molestias, esse veniam hic. Rerum
    repudiandae dicta obcaecati eaque sapiente nesciunt voluptates magni,
    laudantium maiores iste. Perferendis, praesentium officiis repudiandae
    voluptatibus distinctio vitae in suscipit aliquam esse eaque vero sint sequi
    modi et placeat? Optio, quo totam! Molestias voluptates a facilis similique
    corporis explicabo omnis exercitationem, temporibus fuga velit in veniam
    corrupti vel, tenetur dolores accusantium culpa numquam assumenda enim ut
    architecto, error provident. Nostrum beatae tempore, voluptatum molestiae
    enim quod vel dicta excepturi nesciunt delectus iste quo necessitatibus
    perspiciatis nemo ipsum quidem laudantium dignissimos distinctio autem
    veniam cumque dolorum culpa, voluptate commodi. Ex suscipit corrupti, aut
    quae tenetur temporibus culpa nisi iste laudantium repellendus earum ducimus
    libero vitae nihil commodi aspernatur facere consequatur nesciunt autem
    nobis obcaecati! Error voluptas quo culpa odio molestiae asperiores
    exercitationem dignissimos, praesentium quis aspernatur quaerat sunt
    molestias fugit ea harum blanditiis inventore laborum aliquid possimus
    officia? Illum, nesciunt necessitatibus? Aut optio debitis eligendi atque,
    impedit maiores accusantium dicta, aperiam earum reprehenderit, animi
    molestias pariatur! Optio ullam praesentium obcaecati facilis eaque
    dignissimos porro molestias repellat, excepturi hic esse. Dolore assumenda
    consequatur rem? Asperiores rerum illum eligendi sint expedita molestiae
    laborum cum ad consequuntur iste ducimus ab a nobis nesciunt neque voluptas
    hic perspiciatis omnis quos earum, deleniti nisi minus? Atque expedita rerum
    consequatur quo sequi! Placeat provident facilis eos possimus. Soluta
    perferendis, molestiae temporibus voluptatibus atque non eaque totam a autem
    error. Numquam at fugit ad dicta doloribus eos cupiditate eius sequi amet
    dolorem quibusdam quisquam dolor consequatur aspernatur facilis deserunt
    aperiam consequuntur beatae iusto iste impedit rem, nihil quia rerum. Atque
    consectetur natus cumque autem neque inventore ipsa dolorem exercitationem,
    fuga illo labore cum ut soluta repellat quisquam eveniet tenetur distinctio
    eum expedita voluptas deleniti ipsam quia rerum! Natus voluptatum
    dignissimos vel architecto distinctio provident dolore libero numquam, nemo
    quae obcaecati magni omnis sapiente. Nulla recusandae, reiciendis temporibus
    voluptates omnis accusantium, aperiam eligendi tempore exercitationem
    maiores quibusdam vitae adipisci eveniet similique voluptate ipsa fugiat.
  </div>
</template>

<style scoped>
  .dnd-kit-default-overlay {
    transform: translate3d(var(--position-x), var(--position-y), 0px);
  }
</style>
