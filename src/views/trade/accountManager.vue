<template>
  <div class="c-page">
    <app-header>{{$t('trade.text3')}}</app-header>
    <div class="main">
      <router-link to="/accountList?currency=CNY" class="cell">
        <span>CNY</span>
        <span class="cubeic-arrow"></span>
      </router-link>
      <router-link to="/accountList?currency=USD" class="cell">
        <span>USD</span>
        <span class="cubeic-arrow"></span>
      </router-link>
    </div>
  </div>
</template>
