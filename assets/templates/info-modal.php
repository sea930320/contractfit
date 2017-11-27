<?php 
    include_once("../../Locale/language.php");
?>

<div id="modalInfo" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
	<div class="modal-inside">
		<div class="row">
			<div class="small-12 columns">
				<div class="info-title clearfix">
					<img ng-src='{{ "/images/providers/" +  product._provider + "-logo.png" }}' alt="" class="left" />
					<b class="left">{{ product._product }}</b>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="small-12 columns full">
				<table>
				  <tbody>
				    <tr>
				      <td translate>Promoties</td>
				      <td>
					      <ul>

							  {{ product.promotions._value }}
					      </ul>
				    </tr>
				  </tbody>
				</table>
			</div>
		</div>
		<div class="row">
			<div class="small-12 medium-6 columns">
				<b class="info-title" translate>Kenmerken</b>
				<div class="info-table">
					<table>
					  <tbody>
					    <!--<tr>
					      <td>Groene stroom</td>
					      <td>{{ product.green_level._value }}%</td>
					    </tr>-->
					    <!--<tr>
					      <td translate>Contractduur</td>
					      <td translate>Promoties</td>
					    </tr>-->
					    <tr>
					      <td translate>Contractduur</td>
					      <td>{{ product.duration_string._value }}</td>
					    </tr>
					    <!--<tr>
					      <td>Klantendienst</td>
					      <td>{{ product.customer_service._value }}</td>
					    </tr>-->
					    <!--<tr>
					      <td>Factuur</td>
					      <td>{{ product.invoice_type._value }}</td>
					    </tr>-->
					    <tr>
					      <td translate>Beschikbaar in</td>
					      <td>{{ product.availability._value }}</td>
					    </tr>
					    <!--<tr>
					      <td>Groen </td>
					      <td>{{ product.green_level._value }}</td>
					    </tr>-->
					    <tr ng-if=product.green_level._value>
					      <td translate>Groene stroom</td>
					      <td>{{ product.green_level._value }}</td>
					    </tr>
					  </tbody>
					</table>
				</div>
			</div>
			<div class="small-12 medium-6 columns">
				<b class="info-title" translate>Prijzen</b>
				<div class="info-table">
					<table>
					  <tbody>
					    <tr> 
					      <td translate>BTW</td>
					      <td translate>Inbegrepen in berekeningen</td>
					    </tr>
					    <tr> 
					      <td translate>Tarieftype</td>
					      <td>{{ product.rate_type._value }} <span translate>tarief</span></td>
					    </tr>
					    <tr ng-if=product.tariefkaart>
					      <td translate>Tariefkaart</td>
					        <!-- Old code - use in case we want to store pdf tariff cards on the server -->
							<!--<td><a href='{{ "assets/cards/" + product.tariefkaart._value }}' target="_blank">tariefkaart</a></td>-->
							<!-- New code - to be used once all tariff card urls are encoded -->
							<td><a href='{{ product.tariefkaart._value }}' target="_blank" translate>tariefkaart</a></td>
					    </tr>
					    <tr> 
					      <td translate>Betaalwijze</td>
					      <td>{{ product.payment_method._value }} </td>
					    </tr>
					    <tr> 
					      <td translate>Aansluiting / Overstap</td>
					      <td translate>Gratis</td>
					    </tr>
					  </tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="small-12 columns full">
				<table>
				  <tbody>
					    <tr> 
						    <td colspan=2 style="text-align:center;font-weight:bold;" translate>Prijzen zijn berekend volgens de officiële richtlijnen van de energieregulator CREG</td>
					    </tr>
				  </tbody>
				</table>
			</div>
		</div>
		<!-- Close modal -->
		<a class="close-reveal-modal" ng-click="cancel()"></a>
	</div>
</div>
